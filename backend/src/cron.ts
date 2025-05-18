import "./util/envConfig";

import { updateSchedules } from "./jobs/updateSchedulesJob";
import { connectDB } from "./util/db";

const main = async () => {
  const sequelize = await connectDB();

  // detect CI (GitHub sets CI=true, and GITHUB_ACTIONS=true)
  const inCI = !!process.env.GITHUB_ACTIONS;

  try {
    // pass retryOnFail = false in CI, so we exit immediately
    await updateSchedules(sequelize, !inCI);

    process.exit(0);
  } catch (error) {
    console.error("Cron job failed: " + (error as Error).stack);

    process.exit(1);
  }
};

main();
