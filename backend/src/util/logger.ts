import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import "winston-daily-rotate-file";

import { createLogger, format, transports } from "winston";

// detect if we’re running in Vercel (or any serverless)
const isServerless = Boolean(process.env.VERCEL);

// pick a base dir that exists & is writable
const baseLogDir = isServerless ? path.join(os.tmpdir(), "logs") : "logs";

// ensure the directory exists
if (!fs.existsSync(baseLogDir)) {
  fs.mkdirSync(baseLogDir, { recursive: true });
}

const serverLogger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`,
    ),
  ),
  transports: [
    // always log to console
    new transports.Console({ level: "debug" }),

    // file-rotate into /tmp/logs on Vercel, or ./logs locally
    new transports.DailyRotateFile({
      filename: `${baseLogDir}/server-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "14d",
      zippedArchive: true,
      level: "debug",
    }),
  ],
});

const dbLogger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`,
    ),
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: `${baseLogDir}/db-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "14d",
      zippedArchive: true,
      level: "debug",
    }),
  ],
});

export { dbLogger, serverLogger };
