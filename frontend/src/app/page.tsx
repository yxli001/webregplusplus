"use client";

import { getCourseDetails, getCourses } from "@/api/courses";
import Button from "@/components/Button";
import CourseDropdown from "@/components/CourseDropdown";
import CourseList from "@/components/CourseList";
import { useFilterStore } from "@/store/filterStore";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <div className="bg-foreground flex flex-col border border-border rounded-md">
      <h1 className="text-lg font-bold text-text-dark border-b border-border px-5 py-3">
        {title}
      </h1>
      <div className="w-full py-8 px-5">{children}</div>
    </div>
  );
};

export default function Home() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  const selectedCourses = useFilterStore((state) => state.selectedCourses);
  const setCourseDetails = useFilterStore((state) => state.setCourseDetails);

  const handleFetchCourseDetails = () => {
    if (selectedCourses.length < 1) {
      return;
    }

    const fetchDetails = async () => {
      const res = await getCourseDetails(
        selectedCourses.map((course) => `${course.subject} ${course.code}`),
      );

      if (res.success) {
        setCourseDetails(res.data);
      }
    };

    fetchDetails();
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await getCourses();

      if (res.success) {
        setAllCourses(res.data);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="w-full flex flex-col gap-5 ">
      {/* Course Selection */}
      <Section title="Select Your Courses">
        <div className="w-full flex items-center justify-center gap-4">
          <CourseDropdown className="max-w-[30rem]" courses={allCourses} />
          <Button label="Search" onClick={handleFetchCourseDetails} />
        </div>
      </Section>

      {/* Instructor/Section Selection */}
      <Section title="Course List">
        <CourseList />
      </Section>
    </div>
  );
}
