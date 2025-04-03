"use client";

import { getCourses } from "@/api/courses";
import Button from "@/components/Button";
import CourseDropdown from "@/components/CourseDropdown";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import Calendar from "@/icons/Calendar";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await getCourses();

      if (res.success) {
        setCourses(res.data);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <CourseDropdown
        courses={courses}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
      />
      <MultiSelectDropdown
        options={[
          { label: "Cao, Yingjun", value: "A" },
          { label: "Ochoa, Ben", value: "B" },
        ]}
        value={selectedInstructors}
        onChange={setSelectedInstructors}
        placeholder="Select an option"
      />
      <Button label="Update Schedule Options" icon={<Calendar size={24} />} />
    </div>
  );
}
