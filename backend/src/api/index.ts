import { connectDB } from "..//util/db";
import env from "..//util/validateEnv";
import app from "../app";
import { serverLogger } from "../util/logger";

connectDB().then(() => {
  app.listen(env.PORT, () => {
    serverLogger.info(`Server listening on port ${env.PORT}`);
  });
});

export default app;
