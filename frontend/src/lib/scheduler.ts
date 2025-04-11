import { MainSection, SubSection } from "@/types/course";
import {
  convertDaysToNumbers,
  timeToIndex,
  hashSchedule,
  computePreferredDays,
} from "../util/helper";
import { SchedulePreferences } from "@/store/preferenceStore";

const START_TIME = 8 * 60;
const TIME_INTERVAL = 10;
const TOTAL_MINUTES = (22 - 8) * 60;
const TIME_SLOTS = TOTAL_MINUTES / TIME_INTERVAL;

export interface Schedule {
  classes: (MainSection | SubSection)[];
  fitness: number;
}

function isValidEntry(
  schedule: (MainSection | SubSection)[],
  newEntry: MainSection | SubSection,
): boolean {
  //   console.log(newEntry);
  for (let i = 0; i < schedule.length; i++) {
    //console.log(schedule[i]);
    const existingClass = schedule[i];
    if (newEntry === existingClass) {
      continue; // skip self cuz im gonna be using this in a kinda weird way
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
        if (
          (newStartIdx >= existingStartIdx && newStartIdx < existingEndIdx) || // Starts inside another class
          (existingStartIdx >= newStartIdx && existingStartIdx < newEndIdx) || // Another class starts inside new class
          (newStartIdx === existingStartIdx && newEndIdx === existingEndIdx) // Complete overlap
        ) {
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
): boolean {
  //   console.log(newEntry);
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
  changedClasses?: (MainSection | SubSection)[],
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

  // Checks whole schedule if no change classes, else checks only changed classes O(N) vs O(1)
  const classes = changedClasses ? changedClasses : schedule;

  for (const [i, currClass] of classes.entries()) {
    const startIdx = timeToIndex(
      currClass.startTime,
      START_TIME,
      TIME_INTERVAL,
    );
    const endIdx = timeToIndex(currClass.endTime, START_TIME, TIME_INTERVAL);
    const currClassDays = convertDaysToNumbers(currClass.days);

    // Preferred time check
    if (
      currClass.startTime >= updatedPreferences.preferredStart &&
      currClass.endTime <= updatedPreferences.preferredEnd
    ) {
      score += 8;
    }

    // Preferred days check
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
    // Changed j = i+1 to j = 0 slower but don't need to customize as much, can be optimized later
    if (changedClasses !== null) {
      for (let j = 0; j < schedule.length; j++) {
        if (currClass === schedule[j]) continue;
        const other = schedule[j];
        const otherStartIdx = timeToIndex(
          other.startTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const otherEndIdx = timeToIndex(
          other.endTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const otherDays = convertDaysToNumbers(other.days);
        const sharedDays = currClassDays.filter((day) =>
          otherDays.includes(day),
        );

        if (sharedDays.length > 0) {
          // Back-To-Back Preference
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
    } else {
      for (let j = i + 1; j < schedule.length; j++) {
        const other = schedule[j];
        const otherStartIdx = timeToIndex(
          other.startTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const otherEndIdx = timeToIndex(
          other.endTime,
          START_TIME,
          TIME_INTERVAL,
        );
        const otherDays = convertDaysToNumbers(other.days);
        const sharedDays = currClassDays.filter((day) =>
          otherDays.includes(day),
        );

        if (sharedDays.length > 0) {
          // Back-To-Back Preference
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

export async function generateRandomSchedule(
  courseIds: string[],
  mainSectionMap: Map<string, MainSection[]>,
  subSectionMap: Map<string, SubSection[]>,
): Promise<(MainSection | SubSection)[]> {
  const schedule: (MainSection | SubSection)[] = [];
  const timeGrid = Array.from({ length: 7 }, () =>
    Array(TIME_SLOTS).fill(false),
  ); // Track occupied time slots

  for (const courseId of courseIds) {
    // console.log(courseId);
    const mainSections = mainSectionMap.get(courseId) || [];
    // console.log(mainSections);
    const mainSection =
      mainSections[Math.floor(Math.random() * mainSections.length)];
    // console.log(mainSection);
    if (!isValidTimegrid(mainSection, timeGrid)) return [];

    schedule.push(mainSection);

    const subSections = subSectionMap.get(mainSection.id) || [];
    if (subSections.length !== 0) {
      const requiredSections = subSections.filter((s) => s.isRequired);
      const optionalSections = subSections.filter((s) => !s.isRequired);

      const optionalSection = optionalSections.length
        ? optionalSections[Math.floor(Math.random() * optionalSections.length)]
        : null;

      for (const requiredSection of requiredSections) {
        if (requiredSection && isValidTimegrid(requiredSection, timeGrid)) {
          schedule.push(requiredSection);
        } else {
          return [];
        }
      }
      if (optionalSection && isValidTimegrid(optionalSection, timeGrid)) {
        schedule.push(optionalSection);
      } else {
        return [];
      }
    }
  }
  return schedule;
}
export async function generateSchedules(
  quantity: number,
  courseId: string[],
  preferences: SchedulePreferences,
  mainSectionMap: Map<string, MainSection[]>,
  subSectionmap: Map<string, SubSection[]>,
): Promise<Schedule[]> {
  const schedules: Schedule[] = [];
  let validSchedules = 0;
  let iterations = 0;
  while (validSchedules < quantity && iterations < 1000) {
    iterations++;
    const newSchedule = await generateRandomSchedule(
      courseId,
      mainSectionMap,
      subSectionmap,
    );
    if (newSchedule.length != 0) {
      console.log(newSchedule);
      console.log(preferences);
      console.log(calculateFitness(newSchedule, preferences));
      schedules.push({
        classes: newSchedule,
        fitness: calculateFitness(newSchedule, preferences),
      });
      validSchedules++;
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
  randomIndex: number,
  subSectionMap: Map<string, SubSection[]>,
  maxRetries = 5,
) {
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
    subSectionMap.get(selectedEntry.mainSectionId) || []
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
        isValidEntry(schedule, newSection)
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
  selectedEntry: MainSection,
  randomIndex: number,
  mainSectionMap: Map<string, MainSection[]>,
  subSectionMap: Map<string, SubSection[]>,
): boolean {
  const availableMainSections =
    mainSectionMap.get(selectedEntry.courseId) || [];
  if (availableMainSections.length > 1) {
    const newMainSection =
      availableMainSections[
        Math.floor(Math.random() * availableMainSections.length)
      ];

    //  Check if the new mainSection is valid and has no conflicts
    if (isValidEntry(schedule, newMainSection)) {
      //  Replace mainSection if valid
      schedule[randomIndex] = newMainSection;

      // Remove any subSections tied to the old mainSection
      const updatedSchedule = schedule.filter(
        (sec) =>
          !("mainSectionId" in sec && sec.mainSectionId === selectedEntry.id),
      );

      const requiredSubSections = (
        subSectionMap.get(newMainSection.id) || []
      ).filter((subSection) => subSection.isRequired);
      // Add a new optional subSection for the new mainSection if available
      const availableSubSections = (
        subSectionMap.get(newMainSection.id) || []
      ).filter((subSection) => !subSection.isRequired);

      if (requiredSubSections.length > 0) {
        for (const requiredSubSection of requiredSubSections) {
          if (isValidEntry(updatedSchedule, requiredSubSection)) {
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
          if (isValidEntry(updatedSchedule, newSection)) {
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
  mainSectionMap: Map<string, MainSection[]>,
  subSectionMap: Map<string, SubSection[]>,
) {
  const originalFitness = calculateFitness(schedule.classes, preferences);
  let newSchedule = [...schedule.classes];
  let newFitness = originalFitness;
  let iterations = 0;

  // Attempt mutation for 100 iterations or until fitness improves
  while (iterations < 100) {
    iterations++;
    const mutatedSchedule = [...newSchedule];
    const randomIndex = Math.floor(Math.random() * mutatedSchedule.length);
    const selectedEntry = mutatedSchedule[randomIndex];
    let success = false;
    // Mutate SubSection or MainSection
    if ("main_section_id" in selectedEntry) {
      success = mutateSubSection(
        mutatedSchedule,
        selectedEntry as SubSection,
        randomIndex,
        subSectionMap,
      );
    } else {
      success = mutateMainSection(
        mutatedSchedule,
        selectedEntry as MainSection,
        randomIndex,
        mainSectionMap,
        subSectionMap,
      );
    }

    if (!success) {
      continue;
    }
    const hash = hashSchedule({ classes: mutatedSchedule, fitness: 0 });
    if (cache.has(hash)) {
      newFitness = cache.get(hash)!;
    } else {
      newFitness = calculateFitness(mutatedSchedule, preferences);
      cache.set(hash, newFitness);
    }

    const fitnessDifference = newFitness - originalFitness;

    if (
      newFitness >= originalFitness || // Flat acceptance
      Math.random() < Math.exp(fitnessDifference / temperature) // Monte Carlo acceptance
    ) {
      console.log(
        `Accepted Mutation: Original Fitness: ${originalFitness}, New Fitness: ${newFitness}`,
      );
      newSchedule = mutatedSchedule;
      break;
    } else {
      console.log(
        `Rejected Mutation: Original Fitness: ${originalFitness}, New Fitness: ${newFitness}`,
      );
    }
  }
  return {
    classes: newSchedule,
    fitness: newFitness,
  };
}

export default async function generateOptimalSchedule(
  courseId: string[],
  preferences: SchedulePreferences,
  mainSectionMap: Map<string, MainSection[]>,
  subSectionMap: Map<string, SubSection[]>,
): Promise<Schedule[]> {
  console.log(mainSectionMap);
  console.log(subSectionMap);
  let scheduleList = await generateSchedules(
    5,
    courseId,
    preferences,
    mainSectionMap,
    subSectionMap,
  );
  const cache = new Map<string, number>();

  for (let i = 0; i < 1000; i++) {
    // for (const schedule of scheduleList) {
    //   console.log(schedule.classes);
    //   console.log(schedule.fitness);
    // }
    const parents = selectParents(scheduleList);
    const children = parents.map((parent) =>
      mutate(parent, preferences, cache, 10, mainSectionMap, subSectionMap),
    );
    scheduleList = [...parents, ...children];

    //const children = mutate(scheduleList[0], preferences, cache);
    //scheduleList = [children];
  }

  return scheduleList;
}
