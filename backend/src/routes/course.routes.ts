import Course from "@/models/Course.model";
import validationErrorParser from "@/util/validationErrorParser";
import { getCourseDetailsValidator } from "@/validators/course.validator";
import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

const courseRouter = Router();

type CourseQuery = {
  // comma-separate list of courses
  courses: string;
};

/**
 * GET /api/courses
 *
 * Return all courses with no details
 */
courseRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get all courses
      const courses = await Course.findAll();

      res.status(200).json(courses);
    } catch (error: unknown) {
      next(error);
    }
  }),
);

/**
 * GET /api/courses/details?courses="COURSE 1,COURSE 2,COURSE 3..."
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

    const { courses } = matchedData(req, {
      locations: ["query"],
    }) as CourseQuery;

    try {
      const coursesList = courses.split(",").map((course) => course.trim());

      const resCourses = [];
      for (const course of coursesList) {
        const foundCourse = await Course.scope("details").findOne({
          where: {
            subject: course.split(" ")[0],
            code: course.split(" ")[1],
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
