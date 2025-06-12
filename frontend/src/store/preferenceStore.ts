import { createStore } from "zustand/vanilla";

import type { Course, CourseWithSections } from "@/types/course";
import type { SpreadPreference } from "@/types/preferences";

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
  allowedConflicts: Set<string>; // Array of sets of course IDs
};

export type PreferenceState = {
  selectedCourses: Course[];
  courseDetails: CourseWithSections[];
  coursePreferences: CoursePreferences[];
  schedulePreferences: SchedulePreferences;
};

export type PreferenceActions = {
  setSelectedCourses: (courses: Course[]) => void;
  setCourseDetails: (details: CourseWithSections[]) => void;
  removeCourse: (id: string) => void;
  updateCoursePreferences: (
    id: string,
    update: Partial<CoursePreferences>,
  ) => void;
  updateSchedulePreferences: (update: Partial<SchedulePreferences>) => void;
};

export type PreferenceStore = PreferenceState & PreferenceActions;

const initialPreferences: PreferenceState = {
  selectedCourses: [],
  courseDetails: [],
  coursePreferences: [],

  schedulePreferences: {
    spread: "neutral",
    avoidBackToBack: false,
    excludedTimeSlots: [],
    preferredDays: [],
    preferredStart: "08:00",
    preferredEnd: "22:00",
    allowedConflicts: new Set([]),
  },
};

export const createPreferenceStore = (
  initState: PreferenceState = initialPreferences,
) => {
  return createStore<PreferenceStore>((set) => ({
    ...initState,

    setSelectedCourses: (courses) => {
      set(() => ({
        selectedCourses: courses,
      }));
    },

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

    removeCourse: (id) => {
      set((state) => ({
        selectedCourses: state.selectedCourses.filter(
          (course) => course.id !== id,
        ),
        courseDetails: state.courseDetails.filter((course) => course.id !== id),
        coursePreferences: state.coursePreferences.filter(
          (pref) => pref.courseId !== id,
        ),
      }));
    },

    updateCoursePreferences: (id, update) => {
      set((state) => ({
        coursePreferences: state.coursePreferences.map((pref) =>
          pref.courseId === id ? { ...pref, ...update } : pref,
        ),
      }));
    },

    // Schedule Preferences Actions
    updateSchedulePreferences: (update) => {
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
      }));
    },
  }));
};
