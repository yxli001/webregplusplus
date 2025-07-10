"use client";

import { useState } from "react";

import { getCourses } from "@/api/courses";
import Checkbox from "@/components/Checkbox";
import CourseDropdown from "@/components/CourseDropdown";
import { usePreferenceStore } from "@/hooks/usePreferenceStore";

export default function Home() {
  const selectedQuarter = usePreferenceStore((state) => state.selectedQuarter);
  const [checked, setChecked] = useState<undefined | boolean>(undefined);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const fetchCourses = async (query: string) => {
    if (!selectedQuarter) {
      return [];
    }

    setLoadingCourses(true);

    const courses = await getCourses(selectedQuarter, query);

    setLoadingCourses(false);

    if (!courses.success) {
      return [];
    }

    return courses.data;
  };

  return (
    <div>
      {selectedQuarter && (
        <CourseDropdown
          className="w-1/2"
          fetchCourses={fetchCourses}
          loading={loadingCourses || !selectedQuarter}
        />
      )}
      <Checkbox checked={checked} onChange={setChecked} />
    </div>
  );
}
