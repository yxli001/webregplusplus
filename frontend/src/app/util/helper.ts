import { Lecture, Schedule, Section } from "../types/interfaces";

export function timeToIndex(
  time: string,
  startTime: number,
  interval: number,
): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 + minutes - startTime) / interval;
}

export function convertDaysToNumbers(days: string[]): number[] {
  const mapping: { [key: string]: number } = {
    Su: 0,
    M: 1,
    Tu: 2,
    W: 3,
    Th: 4,
    F: 5,
    Sa: 6,
  };
  return days.map((day) => mapping[day]).filter((num) => num !== undefined);
}

export function createLectureLookup(
  lectures: Lecture[],
): Map<number, Lecture[]> {
  const lectureMap = new Map<number, Lecture[]>();
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
): Map<number, Section[]> {
  const sectionMap = new Map<number, Section[]>();
  sections.forEach((section) => {
    if (!sectionMap.has(section.lecture_id)) {
      sectionMap.set(section.lecture_id, []);
    }
    sectionMap.get(section.lecture_id)!.push(section);
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
