import cors from "cors";
import express from "express";
import errorHandler from "./middleware/errorHandler";
import { log } from "./middleware/logger";
import courseRouter from "./routes/course.routes";
import quarterRouter from "./routes/quarter.routes";
import env from "./util/validateEnv";

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
app.use("/api/quarter", quarterRouter);

/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings required here because TypeScript cannot infer the argument types.
 */
app.use(errorHandler);

export default app;
