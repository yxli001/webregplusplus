import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import sequelize from "sequelize";

import Course from "../models/Course.model";
import Quarter from "../models/Quarter.model";
import validationErrorParser from "../util/validationErrorParser";
import {
  getCourseDetailsValidator,
  getCoursesValidator,
} from "../validators/course.validator";

const courseRouter = Router();

type CourseQuery = {
  quarter: string;
  // comma-separate list of courses
  courses: string;
  query: string;
};

/**
 * GET /api/course?quarter=[quarter]&query=[query]
 *
 * Return all courses matching the query in a quarter with no details
 */
courseRouter.get(
  "/",
  getCoursesValidator,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = validationResult(req);

      if (!results.isEmpty()) {
        next(createHttpError(400, validationErrorParser(results)));
      }

      const { quarter, query } = matchedData(req, {
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
      }

      if (!query) {
        const courses = await Course.findAll({
          where: {
            quarterId: foundQuarter!.id,
          },
        });

        res.status(200).json(courses);
        return;
      }

      // Get courses based on query
      const searchQuery = query
        .trim()
        .toLowerCase()
        .replace(/[\s+]+/g, "");

      const filteredCourses = await Course.findAll({
        where: {
          quarterId: foundQuarter!.id,
          [Op.and]: [
            // Match subject and code with the search query
            sequelize.where(
              // Remove spaces from `${subject} ${code}` and convert to lowercase
              sequelize.fn(
                "LOWER",
                sequelize.fn(
                  "REGEXP_REPLACE",
                  sequelize.fn(
                    "CONCAT",
                    sequelize.col("subject"),
                    " ",
                    sequelize.col("code"),
                  ),
                  "\\s+",
                  "",
                  "g",
                ),
              ),
              Op.like,
              `%${searchQuery}%`,
            ),
          ],
        },
      });

      res.status(200).json(filteredCourses);
      return;
    } catch (error: unknown) {
      next(error);
    }
  }),
);

/**
 * GET /api/course/details?quarter=[quarter]&courses="COURSE 1,COURSE 2,COURSE 3..."
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
      }

      const coursesList = courses.split(",").map((course) => course.trim());

      const resCourses = [];
      for (const course of coursesList) {
        const foundCourse = await Course.scope("details").findOne({
          where: {
            subject: course.split("+")[0],
            code: course.split("+")[1],
            quarterId: foundQuarter!.id,
          },
        });

        if (!foundCourse) {
          next(
            createHttpError(
              404,
              `Course ${course} not found in quarter ${quarter}`,
            ),
          );
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
