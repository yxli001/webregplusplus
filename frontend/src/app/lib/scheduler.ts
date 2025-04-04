import { brandon_wi24 } from "./brandon_wi24";
import { Lecture, Preferences, Section, Schedule } from "../types/interfaces";
import {
  convertDaysToNumbers,
  timeToIndex,
  createLectureLookup,
  createSectionLookup,
  hashSchedule,
} from "../util/helper";
const START_TIME = 8 * 60;
const TIME_INTERVAL = 10;
const TOTAL_MINUTES = (22 - 8) * 60;
const TIME_SLOTS = TOTAL_MINUTES / TIME_INTERVAL;

const sample1 = brandon_wi24;
const lectureMap = createLectureLookup(sample1.lectures);
const sectionMap = createSectionLookup(sample1.sections);

function isValidEntry(
  schedule: (Lecture | Section)[],
  newEntry: Lecture | Section,
): boolean {
  console.log(newEntry);
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
          existingClass.start_time,
          START_TIME,
          TIME_INTERVAL,
        );
        const existingEndIdx = timeToIndex(
          existingClass.end_time,
          START_TIME,
          TIME_INTERVAL,
        );
        const newStartIdx = timeToIndex(
          newEntry.start_time,
          START_TIME,
          TIME_INTERVAL,
        );
        const newEndIdx = timeToIndex(
          newEntry.end_time,
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
  newEntry: Lecture | Section,
  timeGrid: boolean[][],
): boolean {
  const days = convertDaysToNumbers(newEntry.days);
  const startIdx = timeToIndex(newEntry.start_time, START_TIME, TIME_INTERVAL);
  const endIdx = timeToIndex(newEntry.end_time, START_TIME, TIME_INTERVAL);
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
  schedule: (Lecture | Section)[],
  preferences: Preferences,
  changedClasses?: (Lecture | Section)[],
): number {
  let score = 0;
  const earliest = Array(7).fill(10000);
  const latest = Array(7).fill(0);

  // Checks whole schedule if no change classes, else checks only changed classes O(N) vs O(1)
  const classes = changedClasses ? changedClasses : schedule;

  for (const [i, currClass] of classes.entries()) {
    const startIdx = timeToIndex(
      currClass.start_time,
      START_TIME,
      TIME_INTERVAL,
    );
    const endIdx = timeToIndex(currClass.end_time, START_TIME, TIME_INTERVAL);
    const currClassDays = convertDaysToNumbers(currClass.days);

    // Preferred time check
    if (
      currClass.start_time >= preferences.preferredStart &&
      currClass.end_time <= preferences.preferredEnd
    ) {
      score += 8;
    }

    // Preferred days check
    for (const day of currClassDays) {
      if (preferences.preferredDays[day]) {
        score += preferences.preferredDays[day];
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
          other.start_time,
          START_TIME,
          TIME_INTERVAL,
        );
        const otherEndIdx = timeToIndex(
          other.end_time,
          START_TIME,
          TIME_INTERVAL,
        );
        const sharedDays = currClass.days.filter((day) =>
          other.days.includes(day),
        );

        if (sharedDays.length > 0) {
          // Back-To-Back Preference
          if (preferences.avoidBackToBack) {
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
          other.start_time,
          START_TIME,
          TIME_INTERVAL,
        );
        const otherEndIdx = timeToIndex(
          other.end_time,
          START_TIME,
          TIME_INTERVAL,
        );
        const sharedDays = currClass.days.filter((day) =>
          other.days.includes(day),
        );

        if (sharedDays.length > 0) {
          // Back-To-Back Preference
          if (preferences.avoidBackToBack) {
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
        duration - preferences.spread / TIME_INTERVAL,
      );
      score += Math.floor(5 / spreadDiff);
    }
  }

  return score;
}

export async function generateRandomSchedule(
  courseIds: number[],
): Promise<(Lecture | Section)[]> {
  const schedule: (Lecture | Section)[] = [];
  const timeGrid = Array.from({ length: 7 }, () =>
    Array(TIME_SLOTS).fill(false),
  ); // Track occupied time slots

  for (const courseId of courseIds) {
    const lectures = lectureMap.get(courseId) || [];

    const lecture = lectures[Math.floor(Math.random() * lectures.length)];

    if (!isValidTimegrid(lecture, timeGrid)) return [];

    schedule.push(lecture);

    const sections = sectionMap.get(lecture.id) || [];
    const requiredSections = sections.filter((s) => s.is_required);
    const optionalSections = sections.filter((s) => !s.is_required);

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

  return schedule;
}
export async function generateSchedules(
  quantity: number,
  courseId: number[],
  preferences: Preferences,
): Promise<Schedule[]> {
  const schedules: Schedule[] = [];
  let validSchedules = 0;
  let iterations = 0;
  while (validSchedules < quantity && iterations < 1000) {
    iterations++;
    const newSchedule = await generateRandomSchedule(courseId);
    if (newSchedule.length != 0) {
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
function mutateSection(
  schedule: (Lecture | Section)[],
  selectedEntry: Section,
  randomIndex: number,
  maxRetries = 5,
) {
  // ❗️ ✅ Check if the selected entry is a required section
  if (selectedEntry.is_required) {
    console.log(
      `⚠️ Section Mutation Skipped: Required section ${JSON.stringify(
        selectedEntry,
      )} cannot be replaced.`,
    );
    return false;
  }

  // ✅ Get available optional sections for the correct lecture
  const availableSections = (
    sectionMap.get(selectedEntry.lecture_id) || []
  ).filter(
    (section) =>
      !section.is_required && // ✅ Only allow non-required sections
      section.id !== selectedEntry.id && // ✅ Avoid replacing with itself
      section.lecture_id === selectedEntry.lecture_id && // ✅ Ensure it's the same lecture
      schedule.every(
        (entry) =>
          entry.id !== section.id || entry.lecture_id !== section.lecture_id,
      ), // ✅ Prevent adding duplicate sections
  );

  // ✅ Handle valid available sections
  if (availableSections.length > 0) {
    let attempts = 0;
    let newSection: Section | null = null;

    // 🔁 Try multiple attempts to get a valid section
    while (attempts < maxRetries) {
      newSection =
        availableSections[Math.floor(Math.random() * availableSections.length)];

      // ✅ Double-check that new section is valid and has no conflicts
      if (
        newSection &&
        selectedEntry.course_id === newSection.course_id &&
        selectedEntry.lecture_id === newSection.lecture_id &&
        isValidEntry(schedule, newSection)
      ) {
        // 🎉 Valid replacement found, swap sections
        schedule[randomIndex] = newSection;
        console.log(
          `✅ Section Mutation: Replaced ${JSON.stringify(
            selectedEntry,
          )} with ${JSON.stringify(newSection)}.`,
        );
        return true;
      } else {
        console.log(
          `⚠️ Attempt ${attempts + 1}: Section mutation failed due to conflict or invalid match.`,
        );
      }
      attempts++;
    }

    // ❌ If no valid section found after max retries
    console.log(
      `❌ No valid section found after ${maxRetries} attempts for section ${JSON.stringify(
        selectedEntry,
      )}. Keeping original section.`,
    );
  } else {
    console.log(
      `❗ No available sections found for lecture_id ${selectedEntry.lecture_id}. Mutation skipped.`,
    );
  }

  return false;
}

function mutateLecture(
  schedule: (Lecture | Section)[],
  selectedEntry: Lecture,
  randomIndex: number,
): boolean {
  const availableLectures = lectureMap.get(selectedEntry.course_id) || [];
  if (availableLectures.length > 1) {
    const newLecture =
      availableLectures[Math.floor(Math.random() * availableLectures.length)];

    //  Check if the new lecture is valid and has no conflicts
    if (isValidEntry(schedule, newLecture)) {
      //  Replace lecture if valid
      schedule[randomIndex] = newLecture;

      // Remove any sections tied to the old lecture
      const updatedSchedule = schedule.filter(
        (sec) => !("lecture_id" in sec && sec.lecture_id === selectedEntry.id),
      );

      // Add a new optional section for the new lecture if available
      const availableSections = (sectionMap.get(newLecture.id) || []).filter(
        (section) => !section.is_required,
      );

      if (availableSections.length > 0) {
        const newSection =
          availableSections[
            Math.floor(Math.random() * availableSections.length)
          ];

        // ✅ Check if the new section is valid before adding it
        if (isValidEntry(updatedSchedule, newSection)) {
          updatedSchedule.push(newSection);
          console.log(
            `🔄 Lecture Mutation: Replaced ${JSON.stringify(
              selectedEntry,
            )} with ${JSON.stringify(newLecture)} and added section ${JSON.stringify(
              newSection,
            )}.`,
          );
        } else {
          console.log(`⚠️ Optional section addition skipped due to conflict.`);
        }
      }

      return true;
    } else {
      console.log(`⚠️ Lecture mutation failed due to conflict.`);
    }
  }
  return false;
}

export function mutate(
  schedule: Schedule,
  preferences: Preferences,
  cache: Map<string, number>,
  temperature: number,
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

    // ✅ Mutate Section or Lecture
    if ("lecture_id" in selectedEntry) {
      // Mutate section
      mutateSection(mutatedSchedule, selectedEntry, randomIndex);
    } else {
      // Mutate lecture and update section
      mutateLecture(mutatedSchedule, selectedEntry, randomIndex);
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
        `✅ Accepted Mutation: Original Fitness: ${originalFitness}, New Fitness: ${newFitness}`,
      );
      newSchedule = mutatedSchedule;
      break;
    } else {
      console.log(
        `❌ Rejected Mutation: Original Fitness: ${originalFitness}, New Fitness: ${newFitness}`,
      );
    }
  }
  return {
    classes: newSchedule,
    fitness: newFitness,
  };
}

export default async function generateOptimalSchedule(
  courseId: number[],
  preferences: Preferences,
): Promise<Schedule[]> {
  let scheduleList = await generateSchedules(2, courseId, preferences);
  const cache = new Map<string, number>();

  for (let i = 0; i < 1000; i++) {
    // for (const schedule of scheduleList) {
    //   console.log(schedule.classes);
    //   console.log(schedule.fitness);
    // }
    const parents = selectParents(scheduleList);
    const children = parents.map((parent) =>
      mutate(parent, preferences, cache, 10),
    );
    scheduleList = [...parents, ...children];

    //const children = mutate(scheduleList[0], preferences, cache);
    //scheduleList = [children];
  }

  return scheduleList;
}
