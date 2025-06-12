import {
  computePreferredDays,
  convertDaysToNumbers,
  hashSchedule,
  isTimeTBA,
  timeToIndex,
} from "../util/helper";
import { parseScheduleEntry } from "../util/helper";

import type { SchedulePreferences } from "@/store/preferenceStore";
import type { Exam, MainSection, SubSection } from "@/types/course";

const START_TIME = 8 * 60;
const TIME_INTERVAL = 10;
const TOTAL_MINUTES = (22 - 8) * 60;
const TIME_SLOTS = TOTAL_MINUTES / TIME_INTERVAL;

export type Schedule = {
  classes: (MainSection | SubSection)[];
  exams: Exam[];
  fitness: number;
};

function isValidEntry(
  schedule: (MainSection | SubSection)[],
  preferences: SchedulePreferences,
  mainSectionByIdMap: Map<string, MainSection>,
  newEntry: MainSection | SubSection,
): boolean {
  //   console.log(newEntry);
  if (isTimeTBA(newEntry)) {
    return true;
  }
  const course_id =
    "courseId" in newEntry
      ? newEntry.courseId
      : mainSectionByIdMap.get(newEntry.mainSectionId)!.courseId;
  if (preferences.allowedConflicts.has(course_id)) {
    return true; // Allow conflict
  }
  const excludedTimeSlots = preferences.excludedTimeSlots;
  for (const slot of excludedTimeSlots) {
    for (let j = 0; j < slot.days.length; j++) {
      if (newEntry.days.includes(slot.days[j])) {
        const excludedStartIdx = timeToIndex(
          slot.startTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const excludedEndIdx = timeToIndex(
          slot.endTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const newStartIdx = timeToIndex(
          newEntry.startTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const newEndIdx = timeToIndex(
          newEntry.endTime,
          START_TIME,
          TIME_INTERVAL,
        );
        // if (
        //   (newStartIdx >= excludedStartIdx && newStartIdx < excludedEndIdx) || // Starts inside another class
        //   (excludedStartIdx >= newStartIdx && excludedStartIdx < newEndIdx) || // Another class starts inside new class
        //   (newStartIdx === excludedStartIdx && newEndIdx === excludedEndIdx) // Complete overlap
        // ) {
        //   return false; // Conflict found
        // }
        // overlap check
        if (
          Math.max(excludedStartIdx, newStartIdx) <
          Math.min(excludedEndIdx, newEndIdx)
        ) {
          return false; // Conflict found
        }
      }
    }
  }
  for (let i = 0; i < schedule.length; i++) {
    //console.log(schedule[i]);
    const existingClass = schedule[i];
    if (newEntry === existingClass) {
      continue; // skip self cuz im gonna be using this in a kinda weird way
    }
    const courseId =
      "courseId" in newEntry
        ? newEntry.courseId
        : mainSectionByIdMap.get(newEntry.mainSectionId)!.courseId;
    if (preferences.allowedConflicts.has(courseId)) {
      continue; // Allow conflict
    }
    // Check if they share any common days
    for (let j = 0; j < existingClass.days.length; j++) {
      if (newEntry.days.includes(existingClass.days[j])) {
        // Convert start & end times to comparable indexes
        const existingStartIdx = timeToIndex(
          existingClass.startTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const existingEndIdx = timeToIndex(
          existingClass.endTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const newStartIdx = timeToIndex(
          newEntry.startTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const newEndIdx = timeToIndex(
          newEntry.endTime,
          START_TIME,
          TIME_INTERVAL,
        );

        // Check if the new entry overlaps with the existing class
        // if (
        //   (newStartIdx >= existingStartIdx && newStartIdx < existingEndIdx) || // Starts inside another class
        //   (existingStartIdx >= newStartIdx && existingStartIdx < newEndIdx) || // Another class starts inside new class
        //   (newStartIdx === existingStartIdx && newEndIdx === existingEndIdx) // Complete overlap
        // ) {
        //   return false; // Conflict found
        // }
        // overlap check
        if (
          Math.max(existingStartIdx, newStartIdx) <
          Math.min(existingEndIdx, newEndIdx)
        ) {
          return false; // Conflict found
        }
      }
    }
  }

  return true; // No conflicts found
}

function isValidExam(exams: Exam[], newExams: Exam[]) {
  for (const newExam of newExams) {
    for (let i = 0; i < exams.length; i++) {
      //console.log(schedule[i]);
      const existingExam = exams[i];
      if (newExam === existingExam) {
        continue; // skip self cuz im gonna be using this in a kinda weird way
      }
      // Check if they share any common days
      if (newExam.date === existingExam.date) {
        // Convert start & end times to comparable indexes
        const existingStartIdx = timeToIndex(
          existingExam.startTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const existingEndIdx = timeToIndex(
          existingExam.endTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const newStartIdx = timeToIndex(
          newExam.startTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const newEndIdx = timeToIndex(
          newExam.endTime,
          START_TIME,
          TIME_INTERVAL,
        );

        // Check if the new entry overlaps with the existing class
        // if (
        //   (newStartIdx >= existingStartIdx && newStartIdx < existingEndIdx) || // Starts inside another class
        //   (existingStartIdx >= newStartIdx && existingStartIdx < newEndIdx) || // Another class starts inside new class
        //   (newStartIdx === existingStartIdx && newEndIdx === existingEndIdx) // Complete overlap
        // ) {
        //   return false; // Conflict found
        // }

        // overlap check
        if (
          Math.max(existingStartIdx, newStartIdx) <
          Math.min(existingEndIdx, newEndIdx)
        ) {
          console.log("Conflict found: Exams");
          return false; // Conflict found
        }
      }
    }
  }
  return true; // No conflicts found
}
function isValidTimegrid(
  newEntry: MainSection | SubSection,
  timeGrid: boolean[][],
  mainSectionByIdMap: Map<string, MainSection>,
  preferences: SchedulePreferences,
): boolean {
  //   console.log(newEntry);
  if (isTimeTBA(newEntry)) {
    return true;
  }
  const course_id =
    "courseId" in newEntry
      ? newEntry.courseId
      : mainSectionByIdMap.get(newEntry.mainSectionId)!.courseId;
  // Allow conflict if course_id is in allowedConflicts
  if (preferences.allowedConflicts.has(course_id)) {
    return true;
  }
  const days = convertDaysToNumbers(newEntry.days);
  const startIdx = timeToIndex(newEntry.startTime, START_TIME, TIME_INTERVAL);
  const endIdx = timeToIndex(newEntry.endTime, START_TIME, TIME_INTERVAL);
  for (const day of days) {
    for (let i = startIdx; i < endIdx; i++) {
      if (timeGrid[day][i]) return false;
    }
    for (let i = startIdx; i < endIdx; i++) {
      timeGrid[day][i] = true;
    }
  }
  return true;
}

// RNG DONE

// fitness test DONE

// selectParents

// crossover

// mutate

// generate schedule loop

export function calculateFitness(
  schedule: (MainSection | SubSection)[],
  preferences: SchedulePreferences,
  // Possible to save O(n) time if we add an extension used when only single class is changed but i feel like the return aint worth.
): number {
  const spreadMap: Record<string, number> = {
    "really-spread-out": 10,
    "slightly-spread-out": 8,
    neutral: 6,
    compact: 4,
    "extremely-compact": 2,
  };

  const updatedPreferences = {
    ...preferences,
    preferredDays: computePreferredDays(preferences.preferredDays),
    spread: spreadMap[preferences.spread],
  };

  let score = 0;
  const earliest = Array(7).fill(10000);
  const latest = Array(7).fill(0);

  for (const currClass of schedule) {
    const startIdx = timeToIndex(
      currClass.startTime,
      START_TIME,
      TIME_INTERVAL,
    );
    const endIdx = timeToIndex(currClass.endTime, START_TIME, TIME_INTERVAL);

    // Preferred time check
    if (!isTimeTBA(currClass)) {
      if (
        currClass.startTime >= updatedPreferences.preferredStart &&
        currClass.endTime <= updatedPreferences.preferredEnd
      ) {
        score += 8;
      }
    }

    // Preferred days check
    const currClassDays =
      currClass.days !== "TBA" ? convertDaysToNumbers(currClass.days) : [];
    for (const day of currClassDays) {
      if (updatedPreferences.preferredDays[day]) {
        score += updatedPreferences.preferredDays[day];
      }
      if (startIdx < earliest[day]) {
        earliest[day] = startIdx;
      }
      if (endIdx > latest[day]) {
        latest[day] = endIdx;
      }
    }
    for (let j = 0; j < schedule.length; j++) {
      if (currClass === schedule[j]) continue;
      const other = schedule[j];
      const otherStartIdx = timeToIndex(
        other.startTime,
        START_TIME,
        TIME_INTERVAL,
      );
      const otherEndIdx = timeToIndex(other.endTime, START_TIME, TIME_INTERVAL);
      const otherDays = convertDaysToNumbers(other.days);
      const sharedDays = currClassDays.filter((day) => otherDays.includes(day));

      if (sharedDays.length > 0) {
        // Back-To-Back Preference

        if (Math.max(startIdx, otherStartIdx) < Math.min(endIdx, otherEndIdx)) {
          score = -100;
          continue; // No need to keep checking other classes
        }
        if (updatedPreferences.avoidBackToBack) {
          if (
            Math.abs(startIdx - otherEndIdx) <= 1 ||
            Math.abs(endIdx - otherStartIdx) <= 1
          ) {
            score -= 5 * sharedDays.length;
          }
        }
      }
    }
  }

  // Overall Fitness (spread preference)
  for (let i = 1; i < 6; i++) {
    if (earliest[i] !== 10000 && latest[i] !== 0) {
      const duration = latest[i] - earliest[i];
      const spreadDiff = Math.abs(
        duration - updatedPreferences.spread / TIME_INTERVAL,
      );
      score += Math.floor(10 / spreadDiff);
    }
  }

  return score;
}

export function generateRandomSchedule(
  courseIds: string[],
  preferences: SchedulePreferences,
  mainSectionByCourseIdMap: Map<string, MainSection[]>,
  subSectionByMainSectionIdMap: Map<string, SubSection[]>,
  mainSectionByIdMap: Map<string, MainSection>,
): Schedule {
  const classes: (MainSection | SubSection)[] = [];
  const exams: Exam[] = [];
  const timeGrid = Array.from({ length: 7 }, () =>
    Array<boolean>(TIME_SLOTS).fill(false),
  ); // Track occupied time slots
  const excludedTimeSlots = preferences.excludedTimeSlots;
  for (const slot of excludedTimeSlots) {
    const days = convertDaysToNumbers(slot.days);
    for (const day of days) {
      const startIdx = timeToIndex(slot.startTime, START_TIME, TIME_INTERVAL);
      const endIdx = timeToIndex(slot.endTime, START_TIME, TIME_INTERVAL);
      for (let i = startIdx; i < endIdx; i++) {
        timeGrid[day][i] = true;
      }
    }
  }

  for (const courseId of courseIds) {
    // console.log(courseId);
    const mainSections = mainSectionByCourseIdMap.get(courseId) ?? [];
    // console.log(mainSections);
    const mainSection =
      mainSections[Math.floor(Math.random() * mainSections.length)];
    // console.log(mainSection);
    if (
      !isValidTimegrid(
        mainSection,
        timeGrid,
        mainSectionByIdMap,
        preferences,
      ) ||
      !isValidExam(exams, mainSection.exams)
    )
      return { classes: [], exams: [], fitness: NaN };

    classes.push(mainSection);

    for (const exam of mainSection.exams) {
      exams.push(exam);
    }
    const subSections = subSectionByMainSectionIdMap.get(mainSection.id) ?? [];
    if (subSections.length !== 0) {
      const requiredSections = subSections.filter((s) => s.isRequired);
      const optionalSections = subSections.filter((s) => !s.isRequired);

      const optionalSection = optionalSections.length
        ? optionalSections[Math.floor(Math.random() * optionalSections.length)]
        : null;

      for (const requiredSection of requiredSections) {
        if (
          requiredSection &&
          isValidTimegrid(
            requiredSection,
            timeGrid,
            mainSectionByIdMap,
            preferences,
          )
        ) {
          classes.push(requiredSection);
        } else {
          return { classes: [], exams: [], fitness: NaN };
        }
      }
      if (
        optionalSection &&
        isValidTimegrid(
          optionalSection,
          timeGrid,
          mainSectionByIdMap,
          preferences,
        )
      ) {
        classes.push(optionalSection);
      } else {
        return { classes: [], exams: [], fitness: NaN };
      }
    }
  }
  return { classes, exams, fitness: NaN };
}
export function generateSchedules(
  quantity: number,
  cache: Map<string, number>,
  courseId: string[],
  preferences: SchedulePreferences,
  mainSectionByCourseIdMap: Map<string, MainSection[]>,
  subSectionByMainSectionIdMap: Map<string, SubSection[]>,
  mainSectionByIdMap: Map<string, MainSection>,
): Schedule[] {
  const schedules: Schedule[] = [];
  let validSchedules = 0;
  let iterations = 0;
  while (validSchedules < quantity && iterations < 1000) {
    iterations++;
    const newSchedule = generateRandomSchedule(
      courseId,
      preferences,
      mainSectionByCourseIdMap,
      subSectionByMainSectionIdMap,
      mainSectionByIdMap,
    );
    if (newSchedule.classes.length !== 0) {
      schedules.push({
        classes: newSchedule.classes,
        exams: newSchedule.exams,
        fitness: calculateFitness(newSchedule.classes, preferences),
      });
      validSchedules++;
      const hash = hashSchedule(newSchedule);
      let fitness = 0;
      if (cache.has(hash)) {
        fitness = cache.get(hash)!;
      } else {
        fitness = calculateFitness(newSchedule.classes, preferences);
        cache.set(hash, fitness);
      }
    }
  }
  return schedules;
}

export function selectParents(schedules: Schedule[]): Schedule[] {
  const sortedSchedules = [...schedules].sort((a, b) => b.fitness - a.fitness);
  const selectedSchedules = sortedSchedules.slice(
    0,
    Math.floor(sortedSchedules.length / 2),
  );
  return selectedSchedules;
}
function mutateSubSection(
  schedule: (MainSection | SubSection)[],
  selectedEntry: SubSection,
  preferences: SchedulePreferences,
  randomIndex: number,
  mainSectionByIdMap: Map<string, MainSection>,
  subSectionByMainSectionIdMap: Map<string, SubSection[]>,
  maxRetries = 5,
) {
  // console.log("Mutating subSection...");
  // Check if the selected entry is a required subSection
  if (selectedEntry.isRequired) {
    // console.log(
    //   ` SubSection Mutation Skipped: Required subSection ${JSON.stringify(
    //     selectedEntry,
    //   )} cannot be replaced.`,
    // );
    return false;
  }

  // Get available optional subSections for the correct mainSection
  const availableSubSections = (
    subSectionByMainSectionIdMap.get(selectedEntry.mainSectionId) ?? []
  ).filter(
    (subSection) =>
      !subSection.isRequired && // Only allow non-required subSections
      subSection.id !== selectedEntry.id && // Avoid replacing with itself
      subSection.mainSectionId === selectedEntry.mainSectionId && // Ensure it's the same mainSection
      schedule.every(
        (entry) =>
          entry.id !== subSection.id ||
          ("mainSectionId" in entry &&
            entry.mainSectionId !== subSection.mainSectionId),
      ), // Prevent adding duplicate subSections
  );

  // Handle valid available subSections
  if (availableSubSections.length > 0) {
    let attempts = 0;
    let newSection: SubSection | null = null;

    while (attempts < maxRetries) {
      newSection =
        availableSubSections[
          Math.floor(Math.random() * availableSubSections.length)
        ];

      // Double-check that new subSection is valid and has no conflicts
      if (
        newSection &&
        selectedEntry.mainSectionId === newSection.mainSectionId &&
        isValidEntry(schedule, preferences, mainSectionByIdMap, newSection)
      ) {
        schedule[randomIndex] = newSection;
        // console.log(
        //   ` SubSection Mutation: Replaced ${JSON.stringify(
        //     selectedEntry,
        //   )} with ${JSON.stringify(newSection)}.`,
        // );
        return true;
      } else {
        // console.log(
        //   ` Attempt ${attempts + 1}: SubSection mutation failed due to conflict or invalid match.`,
        // );
      }
      attempts++;
    }
    // console.log(
    //   ` No valid subSection found after ${maxRetries} attempts for subSection ${JSON.stringify(
    //     selectedEntry,
    //   )}. Keeping original subSection.`,
    // );
  } else {
    // console.log(
    //   ` No available subSections found for main_section_id ${selectedEntry.main_section_id}. Mutation skipped.`,
    // );
  }

  return false;
}

function mutateMainSection(
  schedule: (MainSection | SubSection)[],
  exams: Exam[],
  selectedEntry: MainSection,
  preferences: SchedulePreferences,
  randomIndex: number,
  mainSectionByCourseIdMap: Map<string, MainSection[]>,
  subSectionByMainSectionIdMap: Map<string, SubSection[]>,
  mainSectionByIdMap: Map<string, MainSection>,
): boolean {
  // console.log("Mutating mainSection...");
  const availableMainSections =
    mainSectionByCourseIdMap.get(selectedEntry.courseId) ?? [];
  if (availableMainSections.length > 1) {
    const newMainSection =
      availableMainSections[
        Math.floor(Math.random() * availableMainSections.length)
      ];

    //  Check if the new mainSection is valid and has no conflicts
    if (
      isValidEntry(schedule, preferences, mainSectionByIdMap, newMainSection) &&
      isValidExam(exams, newMainSection.exams)
    ) {
      //  Replace mainSection if valid
      schedule[randomIndex] = newMainSection;
      exams = exams.filter((exam) => exam.mainSectionId !== newMainSection.id);
      for (const newExam of newMainSection.exams) {
        exams.push(newExam);
      }

      // Remove any subSections tied to the old mainSection
      const updatedSchedule = schedule.filter(
        (sec) =>
          !("mainSectionId" in sec && sec.mainSectionId === selectedEntry.id),
      );

      const requiredSubSections = (
        subSectionByMainSectionIdMap.get(newMainSection.id) ?? []
      ).filter((subSection) => subSection.isRequired);
      // Add a new optional subSection for the new mainSection if available
      const availableSubSections = (
        subSectionByMainSectionIdMap.get(newMainSection.id) ?? []
      ).filter((subSection) => !subSection.isRequired);

      if (requiredSubSections.length > 0) {
        for (const requiredSubSection of requiredSubSections) {
          if (
            isValidEntry(
              updatedSchedule,
              preferences,
              mainSectionByIdMap,
              requiredSubSection,
            )
          ) {
            updatedSchedule.push(requiredSubSection);
          } else {
            return false;
          }
        }
        if (availableSubSections.length > 0) {
          const newSection =
            availableSubSections[
              Math.floor(Math.random() * availableSubSections.length)
            ];

          // Check if the new subSection is valid before adding it
          if (
            isValidEntry(
              updatedSchedule,
              preferences,
              mainSectionByIdMap,
              newSection,
            )
          ) {
            updatedSchedule.push(newSection);
            //   console.log(
            //     `🔄 MainSection Mutation: Replaced ${JSON.stringify(
            //       selectedEntry,
            //     )} with ${JSON.stringify(newMainSection)} and added subSection ${JSON.stringify(
            //       newSection,
            //     )}.`,
            //   );
          } else {
            //   console.log(` Optional subSection addition skipped due to conflict.`);
            return false;
          }
        }

        return true;
      } else {
        //   console.log(` MainSection mutation failed due to conflict.`);
      }
    }
  }
  return false;
}

export function mutate(
  schedule: Schedule,
  preferences: SchedulePreferences,
  cache: Map<string, number>,
  temperature: number,
  mainSectionByCourseIdMap: Map<string, MainSection[]>,
  mainSectionByIdMap: Map<string, MainSection>,
  subSectionByMainSectionIdMap: Map<string, SubSection[]>,
): Schedule {
  const originalFitness = calculateFitness(schedule.classes, preferences);
  let newClasses = [...schedule.classes];
  let newExams = [...schedule.exams];
  let newFitness = originalFitness;
  let iterations = 0;

  // Attempt mutation for 100 iterations or until fitness improves
  while (iterations < 100) {
    iterations++;
    const mutatedClasses = [...newClasses];
    const mutatedExams = [...newExams];
    const randomIndex = Math.floor(Math.random() * mutatedClasses.length);
    const selectedEntry = mutatedClasses[randomIndex];
    let success = false;
    let change = "None";
    // Mutate SubSection or MainSection
    if ("mainSectionId" in selectedEntry) {
      success = mutateSubSection(
        mutatedClasses,
        selectedEntry,
        preferences,
        randomIndex,
        mainSectionByIdMap,
        subSectionByMainSectionIdMap,
      );
      change = "sub_section";
    } else {
      success = mutateMainSection(
        mutatedClasses,
        mutatedExams,
        selectedEntry,
        preferences,
        randomIndex,
        mainSectionByCourseIdMap,
        subSectionByMainSectionIdMap,
        mainSectionByIdMap,
      );
      change = "main_section";
    }
    if (!success) {
      continue;
    }
    const hash = hashSchedule({
      classes: mutatedClasses,
      exams: schedule.exams,
      fitness: 0,
    });
    if (cache.has(hash)) {
      newFitness = cache.get(hash)!;
    } else {
      newFitness = calculateFitness(mutatedClasses, preferences);
      cache.set(hash, newFitness);
    }

    const fitnessDifference = newFitness - originalFitness;

    if (
      newFitness > originalFitness || // Flat acceptance
      Math.random() < Math.exp(fitnessDifference / temperature) // Monte Carlo acceptance
    ) {
      //   console.log(
      //     `Accepted Mutation: Original Fitness: ${originalFitness}, New Fitness: ${newFitness}`,
      //   );
      newClasses = mutatedClasses;
      if (change === "main_section") {
        newExams = mutatedExams;
      }
      break;
    } else {
      console.log(
        `Rejected Mutation: Original Fitness: ${originalFitness}, New Fitness: ${newFitness}`,
      );
    }
  }
  return {
    classes: newClasses,
    exams: newExams,
    fitness: newFitness,
  };
}

export default function generateOptimalSchedule(
  courseId: string[],
  preferences: SchedulePreferences,
  mainSectionByCourseIdMap: Map<string, MainSection[]>,
  subSectionByMainSectionIdMap: Map<string, SubSection[]>,
  mainSectionByIdMap: Map<string, MainSection>,
  subSectionByIdMap: Map<string, SubSection>,
): Schedule[] {
  console.log("Main Section Map:", mainSectionByIdMap);
  console.log("Sub Section Map:", subSectionByIdMap);

  const cache = new Map<string, number>();

  let scheduleList = generateSchedules(
    100,
    cache,
    courseId,
    preferences,
    mainSectionByCourseIdMap,
    subSectionByMainSectionIdMap,
    mainSectionByIdMap,
  );

  for (let i = 0; i < 10; i++) {
    const parents = selectParents(scheduleList);
    const children = parents.map((parent) =>
      mutate(
        parent,
        preferences,
        cache,
        10,
        mainSectionByCourseIdMap,
        mainSectionByIdMap,
        subSectionByMainSectionIdMap,
      ),
    );

    scheduleList = [...parents, ...children];
  }
  console.log(cache);

  const sortedCache = [...cache.entries()].sort((a, b) => b[1] - a[1]);
  const loops = sortedCache.length > 10 ? 10 : sortedCache.length;
  const optimalSchedules = Array<Schedule>(loops);
  for (let i = 0; i < loops; i++) {
    optimalSchedules[i] = parseScheduleEntry(
      sortedCache[i],
      mainSectionByIdMap,
      subSectionByIdMap,
    );
  }
  return optimalSchedules;
}
