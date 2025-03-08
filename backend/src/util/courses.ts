import { Course } from "@/types";

export const coursesToString = (courses: Course[]) => {
  return courses
    .map((course) => {
      let str = `${course.subject} ${course.code}: ${course.name}\n`;

      course.mainSections.forEach((mainSection) => {
        str += `  ${mainSection.type} ${mainSection.letter}00 ${mainSection.days} ${mainSection.startTime}-${mainSection.endTime} ${mainSection.instructor}\n`;

        mainSection.sections.forEach((subSection) => {
          str += `    ${subSection.type} ${subSection.section} ${subSection.days} ${subSection.startTime}-${subSection.endTime} ${subSection.isRequired ? "Required" : "Optional"}\n`;
        });
      });

      return str;
    })
    .join("\n");
};
