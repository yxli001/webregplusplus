import { APIResult, get, handleAPIError } from "./requests";

import {
  Course,
  CourseJSON,
  CourseWithSections,
  CourseWithSectionsJSON,
  ExamType,
  MainSectionType,
  Quarter,
  QuarterJSON,
  SubSectionType,
} from "@/types/course";

/**
 * Parses a QuarterJSON object into a Quarter object.
 * @param quarter - The QuarterJSON object to parse.
 * @returns The parsed Quarter object.
 */
const parseQuarter = (quarter: QuarterJSON) => {
  return {
    ...quarter,
    createdAt: new Date(quarter.createdAt),
    updatedAt: new Date(quarter.updatedAt),
  };
};

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
        createdAt: new Date(exam.createdAt),
        updatedAt: new Date(exam.updatedAt),
        date: exam.date,
      })),
      subSections: section.subSections.map((subSection) => ({
        ...subSection,
        type: subSection.type as SubSectionType,
        createdAt: new Date(subSection.createdAt),
        updatedAt: new Date(subSection.updatedAt),
      })),
      createdAt: new Date(section.createdAt),
      updatedAt: new Date(section.updatedAt),
    })),
  };
};

/**
 * Fetches all quarters from the API.
 *
 * @returns A promise that resolves to an APIResult containing an array of quarter names.
 */
const getQuarters: () => Promise<APIResult<Quarter[]>> = async () => {
  try {
    const response = await get("/api/quarter");
    const data = (await response.json()) as QuarterJSON[];

    return {
      success: true,
      data: data.map((quarter) => parseQuarter(quarter)),
    };
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Fetches all courses from the API.
 *
 * @returns A promise that resolves to an APIResult containing an array of Course objects.
 */
const getCourses: (quarter: string) => Promise<APIResult<Course[]>> = async (
  quarter,
) => {
  try {
    const response = await get(`/api/course`, {
      quarter,
    });
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
  quarter: string,
  courseNames: string[],
) => Promise<APIResult<CourseWithSections[]>> = async (
  quarter,
  courseNames,
) => {
  try {
    const response = await get("/api/course/details", {
      quarter,
      courses: courseNames.join(","),
    });
    const data = (await response.json()) as CourseWithSectionsJSON[];

    return {
      success: true,
      data: data.map((course) => parseCourseWithSections(course)),
    };
  } catch (error) {
    return handleAPIError(error);
  }
};

export { getQuarters, getCourses, getCourseDetails };
