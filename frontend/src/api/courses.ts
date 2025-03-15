import { Course, CourseJSON } from "@/types/course";
import { APIResult, get, handleAPIError } from "./requests";

function parseCourse(course: CourseJSON): Course {
  return {
    ...course,
    createdAt: new Date(course.createdAt),
    updatedAt: new Date(course.updatedAt),
  };
}

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
