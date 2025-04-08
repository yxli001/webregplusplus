import { Course, CourseWithSections } from "@/types/course";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type CoursePreference = {
  included: boolean;
  courseId: string;
  selectedMainSections: string[];
  selectedSubSections: string[];
};

type FilterState = {
  selectedCourses: Course[];
  courseDetails: CourseWithSections[];
  coursePreferences: CoursePreference[];

  // Actions
  setSelectedCourses: (courses: Course[]) => void;
  setCourseDetails: (details: CourseWithSections[]) => void;
  removeCourse: (id: string) => void;
  updateCoursePreferences: (
    id: string,
    update: Partial<CoursePreference>,
  ) => void;
};

export const useFilterStore = create(
  subscribeWithSelector<FilterState>((set) => ({
    selectedCourses: [],
    courseDetails: [],
    coursePreferences: [],

    setSelectedCourses: (courses) =>
      set(() => ({
        selectedCourses: courses,
      })),

    setCourseDetails: (details) => {
      set(() => ({
        courseDetails: details,
        coursePreferences: details.map((course) => ({
          included: true,
          courseId: course.id,
          selectedMainSections: course.mainSections.map(
            (section) => section.letter,
          ),
          selectedSubSections: course.mainSections.flatMap((section) =>
            section.subSections.map((subSection) => subSection.section),
          ),
        })),
      }));
    },

    removeCourse: (id) =>
      set((state) => ({
        selectedCourses: state.selectedCourses.filter(
          (course) => course.id !== id,
        ),
        courseDetails: state.courseDetails.filter((course) => course.id !== id),
        coursePreferences: state.coursePreferences.filter(
          (pref) => pref.courseId !== id,
        ),
      })),

    updateCoursePreferences: (id, update) =>
      set((state) => ({
        coursePreferences: state.coursePreferences.map((pref) =>
          pref.courseId === id ? { ...pref, ...update } : pref,
        ),
      })),
  })),
);

export const useCoursePreference = (courseId: string) =>
  useFilterStore((state) =>
    state.coursePreferences.find((pref) => pref.courseId === courseId),
  );
