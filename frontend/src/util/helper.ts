import {
  CourseResponse,
  Course,
  Exam,
  MainSection,
  SubSection,
  Schedule,
} from "@/types/interfaces_api";

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
    if (!mainSectionMap.has(mainSection.course_id)) {
      mainSectionMap.set(mainSection.course_id, []);
    }
    mainSectionMap.get(mainSection.course_id)!.push(mainSection);
  });

  return mainSectionMap;
}

export async function createSubSectionLookup(
  subSections: SubSection[],
): Promise<Map<string, SubSection[]>> {
  const sectionMap = new Map<string, SubSection[]>();
  subSections.forEach((subSection) => {
    if (!sectionMap.has(subSection.main_section_id)) {
      sectionMap.set(subSection.main_section_id, []);
    }
    sectionMap.get(subSection.main_section_id)!.push(subSection);
  });

  return sectionMap;
}

export async function parseAvailableCourses(coursesResponse: CourseResponse[]) {
  const output = {
    courses: [] as Course[],
    mainSection: [] as MainSection[],
    subSection: [] as SubSection[],
    exams: [] as Exam[],
  };

  for (const course of coursesResponse) {
    output.courses.push({
      id: course.id,
      subject: course.subject,
      code: course.code,
    });

    for (const mainSection of course.mainSections) {
      output.mainSection.push({
        id: mainSection.id,
        letter: mainSection.letter,
        type: mainSection.type,
        course_id: course.id,
        instructor: mainSection.instructor,
        days: mainSection.days,
        start_time: convertTo24Hr(mainSection.startTime),
        end_time: convertTo24Hr(mainSection.endTime),
        exam: mainSection.exams.map((exam) => ({
          id: exam.id,
          type: exam.type,
          date: exam.date,
          start_time: convertTo24Hr(exam.startTime),
          end_time: convertTo24Hr(exam.endTime),
          location: exam.location,
          main_section_id: mainSection.id,
        })),
        location: mainSection.location,
      });
      for (const subSection of mainSection.subSections) {
        output.subSection.push({
          id: subSection.id,
          section: subSection.section,
          main_section_id: mainSection.id,
          type: subSection.type,
          days: subSection.days,
          location: subSection.location,
          start_time: convertTo24Hr(subSection.startTime),
          end_time: convertTo24Hr(subSection.endTime),
          is_required: subSection.isRequired,
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
