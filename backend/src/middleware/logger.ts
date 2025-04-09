import { serverLogger } from "@/util/logger";
import { RequestHandler } from "express";

export const log: RequestHandler = (req, res, next) => {
  serverLogger.info(`${req.method}\t${req.url}\t${req.headers.origin}`);

  next();
};
