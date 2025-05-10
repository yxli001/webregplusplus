import "tsconfig-paths/register";
import { envType } from "@/util/envConfig";
import cron from "node-cron";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { serverLogger, dbLogger } from "@/util/logger";
import env from "@/util/validateEnv";
import app from "./app";
import path from "path";
import { updateSchedules } from "./jobs/updateSchedulesJob";

const connectDB = async (): Promise<Sequelize> => {
  try {
    const sequelizeConfig: SequelizeOptions = {
      models: [path.join(__dirname, "/models/*.model.{ts,js}")],
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

    return sequelize;
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const scheduleJobs = (sequelize: Sequelize) => {
  serverLogger.info("Scheduling schedule update job");

  cron.schedule(
    "0 0 * * *",
    async () => {
      serverLogger.info("Starting schedule update job...");
      await updateSchedules(sequelize);
    },
    {
      scheduled: true,
      timezone: "America/Los_Angeles",
    },
  );

  serverLogger.info("Schedule update job scheduled");
};

const startServer = async () => {
  const sequelize = await connectDB();

  updateSchedules(sequelize);
  scheduleJobs(sequelize);

  app.listen(env.PORT, () => {
    serverLogger.info(`Server listening on port ${env.PORT}`);
  });
};

startServer();
