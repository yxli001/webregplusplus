import express from "express";
import cors from "cors";
import { logger } from "./middleware/logger";
import env from "./util/validateEnv";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(express.json());

// logger middleware to log requests
app.use(logger);

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
  }),
);

/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings required here because TypeScript cannot infer the argument types.
 */
app.use(errorHandler);

export default app;
