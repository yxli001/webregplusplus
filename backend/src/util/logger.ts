import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const serverLogger = createLogger({
  level: "debug", // Allow overriding via environment variable
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`,
    ),
  ),
  transports: [
    new transports.Console({ level: "debug" }), // Console logs everything from debug and above
    new transports.DailyRotateFile({
      filename: "logs/server-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "14d",
      zippedArchive: true,
      level: "debug", // Only store debug-level logs and above in files
    }),
  ],
});

// Add a separate transport for database logs
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
      filename: "logs/db-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "14d",
      zippedArchive: true,
      level: "debug", // Only store debug-level logs and above in files
    }),
  ],
});

export { serverLogger, dbLogger };
