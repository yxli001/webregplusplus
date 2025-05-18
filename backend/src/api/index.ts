import app from "../app";
import { connectDB } from "..//util/db";
import { serverLogger } from "../util/logger";
import env from "..//util/validateEnv";

connectDB().then(() => {
  app.listen(env.PORT, () => {
    serverLogger.info(`Server listening on port ${env.PORT}`);
  });
});

export default app;
