import type { Course } from "../types";

export const coursesToString = (courses: Course[]) => {
  return courses
    .map((course) => {
      let str = `${course.subject} ${course.code}: ${course.name}\n`;

      for (const mainSection of course.mainSections) {
        str += `  ${mainSection.type} ${mainSection.letter} ${mainSection.days} ${mainSection.startTime}-${mainSection.endTime} ${mainSection.instructor} ${mainSection.location}\n`;

        for (const section of mainSection.sections) {
          str += `    ${section.type} ${section.section} ${section.days} ${section.startTime}-${section.endTime} ${section.location} ${section.isRequired ? "required" : "not required"}\n`;
        }

        for (const exam of mainSection.exams) {
          str += `    ${exam.type} ${exam.date} ${exam.startTime}-${exam.endTime} ${exam.location}\n`;
        }
      }

      return str;
    })
    .join("\n");
};
