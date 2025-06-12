import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import asyncHandler from "express-async-handler";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

import Course from "../models/Course.model";
import Quarter from "../models/Quarter.model";
import { serverLogger } from "../util/logger";
import validationErrorParser from "../util/validationErrorParser";
import {
  getCourseDetailsValidator,
  getCoursesValidator,
} from "../validators/course.validator";

const courseRouter = Router();

type CourseQuery = {
  // comma-separate list of courses
  quarter: string;
  courses: string;
};

/**
 * GET /api/course?quarter=SP25
 *
 * Return all courses in a quarter with no details
 */
courseRouter.get(
  "/",
  getCoursesValidator,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = validationResult(req);

      if (!results.isEmpty()) {
        next(createHttpError(400, validationErrorParser(results)));
        return;
      }

      const { quarter } = matchedData(req, {
        locations: ["query"],
      }) as CourseQuery;

      // Check if quarter is valid
      const foundQuarter = await Quarter.findOne({
        where: {
          name: quarter,
        },
      });

      if (!foundQuarter) {
        next(createHttpError(404, `Quarter ${quarter} not found`));
        return;
      }

      // Get all courses
      const courses = await Course.findAll({
        where: {
          quarterId: foundQuarter.id,
        },
      });

      res.status(200).json(courses);
    } catch (error: unknown) {
      next(error);
    }
  }),
);

/**
 * GET /api/course/details?quarter=SP25&courses="COURSE 1,COURSE 2,COURSE 3..."
 *
 * Get details for a list of courses
 */
courseRouter.get(
  "/details",
  getCourseDetailsValidator,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
      next(createHttpError(400, validationErrorParser(results)));
      return;
    }

    const { courses, quarter } = matchedData(req, {
      locations: ["query"],
    }) as CourseQuery;

    try {
      const foundQuarter = await Quarter.findOne({
        where: {
          name: quarter,
        },
      });

      if (!foundQuarter) {
        next(createHttpError(404, `Quarter ${quarter} not found`));
        return;
      }

      const coursesList = courses.split(",").map((course) => course.trim());

      const resCourses = [];
      for (const course of coursesList) {
        serverLogger.debug(`Searching for course ${course}`);

        const foundCourse = await Course.scope("details").findOne({
          where: {
            subject: course.split("+")[0],
            code: course.split("+")[1],
            quarterId: foundQuarter.id,
          },
        });

        if (!foundCourse) {
          res.status(404).json({
            message: `${course} not found`,
          });
          return;
        }

        resCourses.push(foundCourse);
      }

      res.status(200).json(resCourses);
    } catch (error: unknown) {
      next(error);
    }
  }),
);

export default courseRouter;
