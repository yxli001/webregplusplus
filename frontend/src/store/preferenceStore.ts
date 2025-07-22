import { createStore } from "zustand/vanilla";

import { Course, CourseWithSections } from "@/types/course";
import { SpreadPreference } from "@/types/preferences";

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
  selectedQuarter: string;
  selectedCourses: Course[];
  courseDetails: CourseWithSections[];
  coursePreferences: CoursePreferences[];
  schedulePreferences: SchedulePreferences;
};

export type PreferenceActions = {
  setSelectedQuarter: (quarter: string) => void;
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
  selectedQuarter: "",
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

    setSelectedQuarter: (quarter) => {
      set(() => ({
        selectedQuarter: quarter,
        selectedCourses: [],
        courseDetails: [],
        coursePreferences: [],
      }));
    },

    setSelectedCourses: (courses) => {
      set(() => ({
        selectedCourses: courses,
      }));
    },

    setCourseDetails: (details) => {
      set((state) => ({
        courseDetails: details,
        coursePreferences: details.map((course) => {
          // Don't update preferences if already exists - prevents overwriting preferences when a new course is added
          const existingPref = state.coursePreferences.find((pref) => {
            return pref.courseId === course.id;
          });

          if (existingPref) return existingPref;

          // Get all unique instructors
          const uniqueInstructors = new Set<string>();
          course.mainSections.forEach((section) => {
            uniqueInstructors.add(section.instructor);
          });

          // Get all subsections
          const initialSubSections = course.mainSections.flatMap((section) =>
            section.subSections.map(
              (subSection) => `${section.letter}${subSection.section}`,
            ),
          );

          return {
            included: true,
            courseId: course.id,
            selectedInstructors: Array.from(uniqueInstructors),
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
            ? update.excludedTimeSlots.map((slot, index) => ({
                ...slot,
                id: `slot-${Date.now()}-${index}`,
              }))
            : state.schedulePreferences.excludedTimeSlots,
        },
      }));
    },
  }));
};
