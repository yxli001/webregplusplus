import CourseCard from "./CourseCard";

import { usePreferenceStore } from "@/hooks/usePreferenceStore";

const CourseList = () => {
  const courseDetails = usePreferenceStore((state) => state.courseDetails);

  return (
    <div className="flex flex-col gap-4">
      {courseDetails.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
