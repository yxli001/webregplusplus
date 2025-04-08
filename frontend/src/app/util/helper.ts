import { Lecture, Schedule, Section } from "../types/interfaces";
import { MainSection, SubSection } from "../types/interfaces_api";

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

export function createLectureLookup(
  lectures: Lecture[],
): Map<string, Lecture[]> {
  const lectureMap = new Map<string, Lecture[]>();
  lectures.forEach((lecture) => {
    if (!lectureMap.has(lecture.course_id)) {
      lectureMap.set(lecture.course_id, []);
    }
    lectureMap.get(lecture.course_id)!.push(lecture);
  });

  return lectureMap;
}

export function createSectionLookup(
  sections: Section[],
): Map<string, Section[]> {
  const sectionMap = new Map<string, Section[]>();
  sections.forEach((section) => {
    if (!sectionMap.has(section.lecture_id)) {
      sectionMap.set(section.lecture_id, []);
    }
    sectionMap.get(section.lecture_id)!.push(section);
  });

  return sectionMap;
}

export function createMainSectionLookup(
  mainSections: MainSection[],
): Map<string, MainSection[]> {
  const mainSectionMap = new Map<string, MainSection[]>();
  mainSections.forEach((mainSection) => {
    if (!mainSectionMap.has(mainSection.course_id)) {
      mainSectionMap.set(mainSection.course_id, []);
    }
    mainSectionMap.get(mainSection.course_id)!.push(mainSection);
  });

  return mainSectionMap;
}

export function createSubSectionLookup(
  subSections: SubSection[],
): Map<string, SubSection[]> {
  const sectionMap = new Map<string, SubSection[]>();
  subSections.forEach((subSection) => {
    if (!sectionMap.has(subSection.main_section_id)) {
      sectionMap.set(subSection.main_section_id, []);
    }
    sectionMap.get(subSection.main_section_id)!.push(subSection);
  });

  return sectionMap;
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
