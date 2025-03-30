import { Course, CourseJSON } from "@/types/course";
import { APIResult, get, handleAPIError } from "./requests";

/**
 * Parses a CourseJSON object into a Course object.
 * @param course - The CourseJSON object to parse.
 * @returns The parsed Course object.
 */
const parseCourse = (course: CourseJSON): Course => {
  return {
    ...course,
    createdAt: new Date(course.createdAt),
    updatedAt: new Date(course.updatedAt),
  };
};

/**
 * Fetches all courses from the API.
 *
 * @returns A promise that resolves to an APIResult containing an array of Course objects.
 */
const getCourses: () => Promise<APIResult<Course[]>> = async () => {
  try {
    const response = await get("/api/course");
    const data = (await response.json()) as CourseJSON[];

    return {
      success: true,
      data: data.map(parseCourse),
    };
  } catch (error) {
    return handleAPIError(error);
  }
};

export { getCourses };
