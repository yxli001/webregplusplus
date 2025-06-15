import { query } from "express-validator";

const validateQueryCourses = query("courses")
  .isString()
  .withMessage("Courses must be a comma separated string of courses")
  .toUpperCase();

const validateQueryQuarter = query("quarter")
  .isString()
  .withMessage("Quarter must be a string")
  .isLength({ min: 4, max: 6 })
  .withMessage("Quarter must be between 4 and 6 characters long")
  .toUpperCase();

const validateQueryQuery = query("query")
  .optional()
  .isString()
  .withMessage("Query must be a string")
  .toLowerCase()
  .trim();

export const getCoursesValidator = [validateQueryQuarter, validateQueryQuery];

export const getCourseDetailsValidator = [
  validateQueryCourses,
  validateQueryQuarter,
];
