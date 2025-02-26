import "module-alias/register";
import "dotenv/config";
import cron from "node-cron";
import { Sequelize } from "sequelize-typescript";
import logger from "@/util/logger";
import env from "@/util/validateEnv";
import { scrapeSchedule } from "@/scrape";

// Schedules scraping job to run every minute
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schedulJobs = () => {
  logger.info("Scheduling scraping jobs");

  cron.schedule(
    "* * * * *",
    async () => {
      logger.info("Running scraping task...");
      await scrapeSchedule();
    },
    {
      scheduled: true,
      timezone: "America/Los_Angeles",
    },
  );

  logger.info("Scraping jobs scheduled");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const startServer = async () => {
  try {
    // Connect to Postgres
    const sequelize = new Sequelize({
      models: [__dirname + "/models/*.model.ts"],
      dialect: "postgres",
      host: env.POSTGRES_HOST,
      port: parseInt(env.POSTGRES_PORT),
      database: env.POSTGRES_DB,
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      ssl: true,
      // dialectOptions: {
      //   ssl: {
      //     require: true,
      //     rejectUnauthorized: false,
      //     ca: fs.readFileSync(join(__dirname, "..", "ca.pem")).toString(),
      //   },
      // },
    });

    // Test DB Connection
    await sequelize.authenticate();

    // Sync models with database
    await sequelize.sync({ alter: true });

    console.log("Database connection established.");
  } catch (error) {
    console.error("Server initialization error:", error);
    process.exit(1); // Exit the process with an error code if initialization fails
  }
};

// startServer();
scrapeSchedule();
