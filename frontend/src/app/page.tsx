"use client";

import { getCourseDetails, getCourses } from "@/api/courses";
import Button from "@/components/Button";
import CourseDropdown from "@/components/CourseDropdown";
import CourseList from "@/components/CourseList";
import Preferences from "@/components/Preferences";
import Calendar from "@/icons/Calendar";
import { usePreferenceStore } from "@/store/preferenceStore";
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
      <div className="w-full p-8">{children}</div>
    </div>
  );
};

export default function Home() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  const selectedCourses = usePreferenceStore((state) => state.selectedCourses);
  const setCourseDetails = usePreferenceStore(
    (state) => state.setCourseDetails,
  );
  const courseDetails = usePreferenceStore((state) => state.courseDetails);

  const coursePreferences = usePreferenceStore(
    (state) => state.coursePreferences,
  );
  const schedulePreferences = usePreferenceStore(
    (state) => state.schedulePreferences,
  );

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
    <div className="w-full flex flex-col gap-10">
      {/* Course Selection */}
      <Section title="Select Your Courses">
        <div className="w-full flex items-center justify-center gap-4">
          <CourseDropdown className="max-w-[30rem]" courses={allCourses} />
          <Button label="Search" onClick={handleFetchCourseDetails} />
        </div>
      </Section>

      {/* Instructor/Section Selection */}
      {courseDetails.length > 0 && (
        <>
          <Section title="Course List">
            <CourseList />
          </Section>

          <Section title="Filters">
            <Preferences />
          </Section>

          <Button
            icon={<Calendar />}
            label="Update Schedule"
            className="self-end"
            onClick={() => {
              console.log(coursePreferences);
              console.log(schedulePreferences);
            }}
          />
        </>
      )}
    </div>
  );
}
