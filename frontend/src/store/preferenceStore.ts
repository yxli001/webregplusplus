import { Course, CourseWithSections } from "@/types/course";
import { SpreadPreference } from "@/types/preferences";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type TimeSlot = {
  id: string;
  days: string;
  startTime: string;
  endTime: string;
};

export type CoursePreferences = {
  included: boolean;
  courseId: string;
  selectedInstructors: string[];
  selectedSubSections: string[];
};

export type SchedulePreferences = {
  spread: SpreadPreference;
  avoidBackToBack: boolean;
  excludedTimeSlots: TimeSlot[];
  preferredDays: string[];
  preferredStart: string; // 24-hour format HH:mm
  preferredEnd: string; // 24-hour format HH:mm
};

type PreferenceState = {
  selectedCourses: Course[];
  courseDetails: CourseWithSections[];
  coursePreferences: CoursePreferences[];
  schedulePreferences: SchedulePreferences;

  // Actions
  setSelectedCourses: (courses: Course[]) => void;
  setCourseDetails: (details: CourseWithSections[]) => void;
  removeCourse: (id: string) => void;
  updateCoursePreferences: (
    id: string,
    update: Partial<CoursePreferences>,
  ) => void;

  // Schedule Preferences Actions
  updateSchedulPreferences: (update: Partial<SchedulePreferences>) => void;
};

export const usePreferenceStore = create(
  subscribeWithSelector<PreferenceState>((set) => ({
    selectedCourses: [],
    courseDetails: [],
    coursePreferences: [],

    // Schedule Preferences - Initial Values
    schedulePreferences: {
      spread: "neutral",
      avoidBackToBack: false,
      excludedTimeSlots: [],
      preferredDays: [],
      preferredStart: "08:00",
      preferredEnd: "22:00",
    },

    setSelectedCourses: (courses) =>
      set(() => ({
        selectedCourses: courses,
      })),

    setCourseDetails: (details) => {
      set(() => ({
        courseDetails: details,
        coursePreferences: details.map((course) => {
          // Get unique instructors for this course
          const uniqueInstructors = Array.from(
            new Set(course.mainSections.map((section) => section.instructor)),
          );

          // Get all subsections from sections with the first instructor
          const firstInstructor = uniqueInstructors[0];
          const initialSubSections = course.mainSections
            .filter((section) => section.instructor === firstInstructor)
            .flatMap((section) =>
              section.subSections
                .filter((subSection) => !subSection.isRequired)
                .map((subSection) => `${section.letter}${subSection.section}`),
            );

          return {
            included: true,
            courseId: course.id,
            selectedInstructors: [firstInstructor],
            selectedSubSections: initialSubSections,
          };
        }),
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

    // Schedule Preferences Actions
    updateSchedulPreferences: (update) =>
      set((state) => ({
        schedulePreferences: {
          ...state.schedulePreferences,
          ...update,
          excludedTimeSlots: update.excludedTimeSlots
            ? update.excludedTimeSlots.map((slot) => ({
                ...slot,
                id: Math.random().toString(36).substring(7),
              }))
            : state.schedulePreferences.excludedTimeSlots,
        },
      })),
  })),
);

export const useCoursePreference = (courseId: string) =>
  usePreferenceStore((state) =>
    state.coursePreferences.find((pref) => pref.courseId === courseId),
  );
