import {
  Course,
  CourseJSON,
  CourseWithSections,
  CourseWithSectionsJSON,
  ExamType,
  MainSectionType,
} from "@/types/course";
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
 * Parses a CourseWithSectionsJSON object into a CourseWithSection object
 * @param course - The CourseWithSectionsJSON
 * @returns The parsed CourseWithSections object
 */
const parseCourseWithSections = (
  course: CourseWithSectionsJSON,
): CourseWithSections => {
  return {
    ...course,
    createdAt: new Date(course.createdAt),
    updatedAt: new Date(course.updatedAt),
    mainSections: course.mainSections.map((section) => ({
      ...section,
      type: section.type as MainSectionType,
      startTime: section.startTime,
      endTime: section.endTime,
      exams: section.exams.map((exam) => ({
        ...exam,
        type: exam.type as ExamType,
        date: new Date(exam.date),
        startTime: exam.startTime,
        endTime: exam.endTime,
      })),
    })),
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

const getCourseDetails: (
  courseNames: string[],
) => Promise<APIResult<CourseWithSections[]>> = async (courseNames) => {
  try {
    const response = await get("/api/course/details", {
      courses: courseNames.join(","),
    });
    const data = (await response.json()) as CourseWithSectionsJSON[];

    return {
      success: true,
      data: data.map(parseCourseWithSections),
    };
  } catch (error) {
    return handleAPIError(error);
  }
};

export { getCourses, getCourseDetails };
