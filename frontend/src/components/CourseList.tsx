import { BookOpen, Eye, EyeOffIcon, Trash2 } from "lucide-react";
import { useCallback } from "react";

import Dropdown from "./dropdown/Dropdown";

import {
  useCoursePreference,
  usePreferenceStore,
} from "@/hooks/usePreferenceStore";
import { CourseWithSections } from "@/types/course";

const CourseCard = ({ course }: { course: CourseWithSections }) => {
  const pref = useCoursePreference(course.id)!;
  const updateCoursePreferences = usePreferenceStore(
    (state) => state.updateCoursePreferences,
  );
  const removeCourse = usePreferenceStore((state) => state.removeCourse);

  // Event Handlers

  const handleToggleIncluded = useCallback(() => {
    updateCoursePreferences(course.id, { included: !pref.included });
  }, [course.id, pref.included, updateCoursePreferences]);

  const handleDeleteCourse = useCallback(() => {
    removeCourse(course.id);
  }, [course.id, removeCourse]);

  return (
    <Dropdown
      key={course.id}
      value={course.id}
      title={`${course.subject} ${course.code}`}
      icon={<BookOpen size={16} />}
      actions={[
        { icon: <Trash2 size={16} />, onClick: handleDeleteCourse },
        {
          icon: pref.included ? <Eye size={16} /> : <EyeOffIcon size={16} />,
          onClick: handleToggleIncluded,
        },
      ]}
      defaultOpen
    >
      Hello
    </Dropdown>
  );
};

const CourseList = () => {
  const courseDetails = usePreferenceStore((state) => state.courseDetails);
  // const coursePreferences = usePreferenceStore(
  //   (state) => state.coursePreferences,
  // );

  return (
    <div className="flex flex-col gap-4">
      {courseDetails.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
