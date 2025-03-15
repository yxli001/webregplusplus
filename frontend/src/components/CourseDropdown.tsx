"use client";

import { getCourses } from "@/api/courses";
import { Course } from "@/types/course";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";

interface CourseDropdownProps {
  courses: Course[];
}

const CourseDropdown = ({ courses }: CourseDropdownProps) => {
  const [shownCourses, setShownCourses] = useState<Course[]>(courses);
  const [selectedCourse, setSelectedCourse] = useState<Course>();

  useEffect(() => {
    getCourses().then((res) => {
      if (res.success) {
        setShownCourses(res.data);
      }
    });
  }, []);

  return (
    <MultiSelect
      className="w-full flex"
      value={selectedCourse}
      onChange={(e) => setSelectedCourse(e.value)}
      options={shownCourses.map((course) => {
        return {
          label: `${course.subject} ${course.code}`,
          value: course,
        };
      })}
      optionLabel="label"
      placeholder="Select a course"
      virtualScrollerOptions={{
        itemSize: 50,
      }}
      showSelectAll={false}
      display="chip"
      filter
    />
  );
};

export default CourseDropdown;
