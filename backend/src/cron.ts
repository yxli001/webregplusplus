import "../util/envConfig";

import { updateSchedules } from "./jobs/updateSchedulesJob";
import { connectDB } from "./util/db";

async function main() {
  const sequelize = await connectDB();

  await updateSchedules(sequelize);
}

main();
