import Quarter from "../models/Quarter.model";
import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";

const quarterRouter = Router();

/**
 * GET /api/quarter
 *
 * Return all courses with no details
 */
quarterRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get all courses
      const quarters = await Quarter.findAll();

      res.status(200).json(quarters);
    } catch (error: unknown) {
      next(error);
    }
  }),
);

export default quarterRouter;
