import { query } from "express-validator";

const validateParamCourses = query("courses")
  .isString()
  .withMessage("Courses must be a comma separated string of courses")
  .toUpperCase();

const validateParamQuarter = query("quarter")
  .isString()
  .withMessage("Quarter must be a string")
  .isLength({ min: 4, max: 6 })
  .withMessage("Quarter must be between 4 and 6 characters long")
  .toUpperCase();

export const getCoursesValidator = [validateParamQuarter];

export const getCourseDetailsValidator = [
  validateParamCourses,
  validateParamQuarter,
];
