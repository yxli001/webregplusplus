import { Course } from "@/types";

export const coursesToString = (courses: Course[]) => {
  return courses
    .map((course) => {
      let str = `${course.subject} ${course.code}: ${course.name}\n`;

      course.mainSections.forEach((mainSection) => {
        str += `  ${mainSection.type} ${mainSection.letter} ${mainSection.days} ${mainSection.startTime}-${mainSection.endTime} ${mainSection.instructor} ${mainSection.location}\n`;

        mainSection.sections.forEach((section) => {
          str += `    ${section.type} ${section.section} ${section.days} ${section.startTime}-${section.endTime} ${section.location} ${section.isRequired ? "required" : "not required"}\n`;
        });

        mainSection.exams.forEach((exam) => {
          str += `    ${exam.type} ${exam.date} ${exam.startTime}-${exam.endTime} ${exam.location}\n`;
        });
      });

      return str;
    })
    .join("\n");
};
