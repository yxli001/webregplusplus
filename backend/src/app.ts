import express from "express";
import cors from "cors";
import { log } from "./middleware/logger";
import env from "./util/validateEnv";
import errorHandler from "./middleware/errorHandler";
import courseRouter from "./routes/course.routes";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
  }),
);

// logger middleware to log requests
app.use(log);

// Routes
app.use("/api/course", courseRouter);

/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings required here because TypeScript cannot infer the argument types.
 */
app.use(errorHandler);

export default app;
