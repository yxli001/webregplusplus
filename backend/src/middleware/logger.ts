import logger from "@/util/logger";
import { RequestHandler } from "express";

export const log: RequestHandler = (req, res, next) => {
  logger.info(`${req.method}\t${req.url}\t${req.headers.origin}`);

  next();
};
