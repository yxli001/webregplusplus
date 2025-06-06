import { RequestHandler } from "express";

import { serverLogger } from "../util/logger";

export const log: RequestHandler = (req, res, next) => {
  serverLogger.info(
    `${req.method}\t${req.url}\t${req.headers.origin ? req.headers.origin : "Unknown Origin"}`,
  );

  next();
};
