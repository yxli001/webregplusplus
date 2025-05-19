import app from "./app";
import { connectDB } from "./util/db";
import { serverLogger } from "./util/logger";
import env from "./util/validateEnv";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    serverLogger.info(`Server listening on port ${env.PORT}`);
  });
};

startServer();
