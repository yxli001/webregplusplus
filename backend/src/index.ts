import "module-alias/register";
import { envType } from "@/util/envConfig";
import cron from "node-cron";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { serverLogger, dbLogger } from "@/util/logger";
import env from "@/util/validateEnv";
import { scrapeSchedule } from "@/scrape";
import { coursesToString } from "./util/courses";
import Course from "./models/Course.model";
import MainSection from "./models/MainSection.model";
import SubSection from "./models/SubSection.model";
import Exam from "./models/Exam.model";
import app from "./app";

const connectDB = async () => {
  try {
    const sequelizeConfig: SequelizeOptions = {
      models: [__dirname + "/models/*.model.ts"],
      dialect: "postgres",
      host: env.POSTGRES_HOST,
      port: parseInt(env.POSTGRES_PORT),
      database: env.POSTGRES_DB,
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      logging: (sql) => {
        dbLogger.debug(sql); // Log SQL queries to the database log file
      },
    };

    // Conditionally add `dialectOptions` for staging and production
    if (envType === "staging" || envType === "production") {
      sequelizeConfig.dialectOptions = {
        ssl: {
          require: true, // Use SSL in staging and production
          rejectUnauthorized: false, // Allow self-signed certificates
        },
      };
    }

    // Connect to Postgres
    const sequelize = new Sequelize(sequelizeConfig);

    // Test DB Connection
    await sequelize.authenticate();

    // Sync models with database
    await sequelize.sync({ alter: true });

    console.log("Database connection established.");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with an error code if initialization fails
  }
};

const updateSchedules = async () => {
  // logger.info("Dropping old schedules...");
  // await Course.drop({ cascade: true });
  // await MainSection.drop({ cascade: true });
  // await SubSection.drop({ cascade: true });
  // await Exam.drop({ cascade: true });

  serverLogger.info("Updating schedules...");

  const courses = await scrapeSchedule();

  serverLogger.debug("\nScraped Courses: \n" + coursesToString(courses));

  for (const course of courses) {
    const newCourse = await Course.create({
      code: course.code,
      subject: course.subject,
    });

    for (const main of course.mainSections) {
      const newMain = await MainSection.create({
        letter: main.letter,
        days: main.days,
        startTime: main.startTime,
        endTime: main.endTime,
        instructor: main.instructor,
        location: main.location,
        type: main.type,
        courseId: newCourse.id,
      });

      for (const sub of main.sections) {
        await SubSection.create({
          days: sub.days,
          startTime: sub.startTime,
          endTime: sub.endTime,
          isRequired: sub.isRequired,
          location: sub.location,
          section: sub.section,
          type: sub.type,
          mainSectionId: newMain.id,
        });
      }

      for (const exam of main.exams) {
        await Exam.create({
          date: exam.date,
          endTime: exam.endTime,
          location: exam.location,
          startTime: exam.startTime,
          type: exam.type,
          mainSectionId: newMain.id,
        });
      }
    }
  }
};

// Schedules scraping job to run every minute
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scheduleJobs = () => {
  serverLogger.info("Scheduling schedule update job");

  cron.schedule(
    "0 0 * * 0",
    async () => {
      serverLogger.info("Starting schedule update job...");
      await updateSchedules();
    },
    {
      scheduled: true,
      timezone: "America/Los_Angeles",
    },
  );

  serverLogger.info("Schedule update job scheduled");
};

const startServer = async () => {
  await connectDB();

  // scheduleJobs();
  // updateSchedules();

  app.listen(env.PORT, () => {
    serverLogger.info(`Server listening on port ${env.PORT}`);
  });
};

startServer();
