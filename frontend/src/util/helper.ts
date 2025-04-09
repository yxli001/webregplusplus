import { Schedule } from "@/lib/scheduler";
import {
  CourseWithSections,
  Exam,
  MainSection,
  SubSection,
} from "@/types/course";

export function timeToIndex(
  time: string,
  startTime: number,
  interval: number,
): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 + minutes - startTime) / interval;
}

export function convertTo24Hr(time: string): string {
  const match = time.match(/(\d+):(\d+)([ap])/i);
  if (!match) return time;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, h, m, period] = match;
  let hour = parseInt(h);
  if (period.toLowerCase() === "p" && hour !== 12) hour += 12;
  if (period.toLowerCase() === "a" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${m}`;
}
// export function convertDaysToNumbers(days: string[]): number[] {
//   const mapping: { [key: string]: number } = {
//     Su: 0,
//     M: 1,
//     Tu: 2,
//     W: 3,
//     Th: 4,
//     F: 5,
//     Sa: 6,
//   };
//   return days.map((day) => mapping[day]).filter((num) => num !== undefined);
// }

export function computePreferredDays(selectedDays: string[]): number[] {
  const scores = new Array(7).fill(0);
  for (const day of selectedDays) {
    const dayScoreMap: Record<string, { index: number; score: number }> = {
      Su: { index: 0, score: 0 },
      M: { index: 1, score: 6 },
      Tu: { index: 2, score: 9 },
      W: { index: 3, score: 6 },
      Th: { index: 4, score: 9 },
      F: { index: 5, score: 6 },
      Sa: { index: 6, score: 0 },
    };
    const mapping = dayScoreMap[day];
    if (mapping) {
      scores[mapping.index] = mapping.score;
    }
  }
  return scores;
}

export function convertDaysToNumbers(days: string): number[] {
  const mapping: { [key: string]: number } = {
    Su: 0,
    M: 1,
    Tu: 2,
    W: 3,
    Th: 4,
    F: 5,
    Sa: 6,
  };

  const pattern = /Su|Tu|Th|Sa|M|W|F/g;
  const matches = days.match(pattern) || [];

  return matches.map((day) => mapping[day]);
}
export async function createMainSectionLookup(
  mainSections: MainSection[],
): Promise<Map<string, MainSection[]>> {
  const mainSectionMap = new Map<string, MainSection[]>();
  mainSections.forEach((mainSection) => {
    if (!mainSectionMap.has(mainSection.courseId)) {
      mainSectionMap.set(mainSection.courseId, []);
    }
    mainSectionMap.get(mainSection.courseId)!.push(mainSection);
  });

  return mainSectionMap;
}

export async function createSubSectionLookup(
  subSections: SubSection[],
): Promise<Map<string, SubSection[]>> {
  const sectionMap = new Map<string, SubSection[]>();
  subSections.forEach((subSection) => {
    if (!sectionMap.has(subSection.mainSectionId)) {
      sectionMap.set(subSection.mainSectionId, []);
    }
    sectionMap.get(subSection.mainSectionId)!.push(subSection);
  });

  return sectionMap;
}

export async function parseAvailableCourses(
  coursesResponse: CourseWithSections[],
) {
  const output = {
    courses: [] as CourseWithSections[],
    mainSection: [] as MainSection[],
    subSection: [] as SubSection[],
    exams: [] as Exam[],
  };

  for (const course of coursesResponse) {
    output.courses.push({
      ...course,
    });

    for (const mainSection of course.mainSections) {
      output.mainSection.push({
        // TODO: refactor so that we dont store the subSections twice
        ...mainSection,
        startTime: convertTo24Hr(mainSection.startTime),
        endTime: convertTo24Hr(mainSection.endTime),
        exams: mainSection.exams.map((exam) => ({
          ...exam,
          startTime: convertTo24Hr(exam.startTime),
          endTime: convertTo24Hr(exam.endTime),
        })),
      });
      for (const subSection of mainSection.subSections) {
        output.subSection.push({
          ...subSection,
          startTime: convertTo24Hr(subSection.startTime),
          endTime: convertTo24Hr(subSection.endTime),
        });
      }
    }
  }
  return output;
}

export function hashSchedule(schedule: Schedule): string {
  let hash = 0;
  const str = schedule.classes
    .map(
      (currClass) => `${currClass.id}:${"lecture_id" in currClass ? "L" : "S"}`,
    )
    .join("|");

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1_000_000_007;
  }
  return hash.toString();
}
