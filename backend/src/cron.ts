import "./util/envConfig";

import { updateSchedules } from "./jobs/updateSchedulesJob";
import { connectDB } from "./util/db";

const RETRY_DELAY = 1000 * 60 * 2; // 2 minutes

const main = async () => {
  const sequelize = await connectDB();

  try {
    await new Promise<void>((resolve) => {
      const runWithRetryHandling = async () => {
        try {
          await updateSchedules(sequelize);

          resolve(); // If successful, resolve the promise
        } catch (error) {
          console.error("Error in job execution:", error);
          console.log(`Retrying in ${RETRY_DELAY / 6000} minutes`);

          // Instead of exiting, set a timeout to retry
          setTimeout(runWithRetryHandling, RETRY_DELAY);
        }
      };

      runWithRetryHandling();
    });

    console.log("Job completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Fatal error in cron job: " + (error as Error).stack);
    process.exit(1);
  }
};

// The process will stay alive until either:
// 1. The job completes successfully and we call process.exit(0)
// 2. A fatal error occurs and we call process.exit(1)
// 3. The job keeps failing and an external process (like systemd) kills it
main();
