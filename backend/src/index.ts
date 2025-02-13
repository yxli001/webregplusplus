import dotenv from "dotenv";
import cron from "node-cron";

import scrape from "./scrape";
import logger from "./logger";

dotenv.config();

const schedulJobs = () => {
  logger.debug("Scheduling scraping jobs");

  // Schedule the job to run every hour (adjust as needed)
  cron.schedule(
    "* * * * *",
    async () => {
      logger.debug("Running scraping task...");
      await scrape();
    },
    {
      scheduled: true,
      timezone: "America/Los_Angeles",
    },
  );

  logger.debug("Scraping jobs scheduled");
};

schedulJobs();
