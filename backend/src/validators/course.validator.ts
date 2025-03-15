import { query } from "express-validator";

const validateParamCourses = query("courses")
  .isString()
  .withMessage("Courses must be a comma separated string of courses")
  .toUpperCase();

export const getCourseDetailsValidator = [validateParamCourses];
