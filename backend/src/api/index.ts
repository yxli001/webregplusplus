import app from "../app";
import env from "../util/validateEnv";
import { serverLogger } from "../util/logger";

app.listen(env.PORT, () => {
  serverLogger.info(`Server listening on port ${env.PORT}`);
});

export default app;
