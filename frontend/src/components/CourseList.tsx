import { BookOpen, Eye, Trash2 } from "lucide-react";

import Dropdown from "./dropdown/Dropdown";

import { usePreferenceStore } from "@/hooks/usePreferenceStore";

const CourseList = () => {
  const courseDetails = usePreferenceStore((state) => state.courseDetails);

  return (
    <div className="flex flex-col gap-4">
      {courseDetails.map((course) => (
        <Dropdown
          key={course.id}
          value={course.id}
          title={`${course.subject} ${course.code}`}
          icon={<BookOpen size={16} />}
          actions={[
            { icon: <Trash2 size={16} /> },
            { icon: <Eye size={16} /> },
          ]}
          defaultOpen
        >
          Hello
        </Dropdown>
      ))}
    </div>
  );
};

export default CourseList;
