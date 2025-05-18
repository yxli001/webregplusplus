import "tsconfig-paths/register";
import { serverLogger } from "@/util/logger";
import { connectDB } from "./util/db";
import env from "@/util/validateEnv";
import app from "./app";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    serverLogger.info(`Server listening on port ${env.PORT}`);
  });
};

startServer();
