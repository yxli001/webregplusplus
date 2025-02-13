import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

// Setup daily rotating logs
const dailyRotateTransport = new transports.DailyRotateFile({
  filename: "logs/scraper-%DATE%.log", // File format
  datePattern: "YYYY-MM-DD",
  maxSize: "10m", // Max size per file
  maxFiles: "14d", // Keep logs for 14 days
  zippedArchive: true, // Compress old logs
});

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`,
    ),
  ),
  transports: [
    new transports.Console(), // Console logging
    dailyRotateTransport, // File logging
  ],
});

export default logger;
