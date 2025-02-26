import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

// Define log levels
const logger = createLogger({
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
      filename: "logs/scraper-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "14d",
      zippedArchive: true,
      level: "info", // Only store info-level logs and above in files
    }),
  ],
});

export default logger;
