"use client";

import { getCourseDetails, getCourses } from "@/api/courses";
import {
  createMainSectionLookup,
  createSubSectionLookup,
  parseAvailableCourses,
} from "@/util/helper";
import generateOptimalSchedule from "@/lib/scheduler";
import { convertDaysToNumbers } from "@/util/helper";
import {
  CourseResponse,
  MainSection,
  Preferences,
  Schedule,
  SubSection,
} from "../types/interfaces_api";
import Button from "@/components/Button";
import CourseDropdown from "@/components/CourseDropdown";
import CourseList from "@/components/CourseList";
import PreferencesComponent from "@/components/Preferences";
import Calendar from "@/icons/Calendar";
import {
  SchedulePreferences,
  usePreferenceStore,
} from "@/store/preferenceStore";
import { Course } from "@/types/course";
import { useCallback, useEffect, useState } from "react";
import ScheduleDisplay from "@/components/ScheduleDisplay";

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  daysOfWeek?: number[];
  extendedProps?: {
    instructor?: string;
    location?: string;
    meeting_type?: string;
  };
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
  const [events, setEvents] = useState<Event[][]>([]);
  const selectedCourses = usePreferenceStore((state) => state.selectedCourses);
  const setCourseDetails = usePreferenceStore(
    (state) => state.setCourseDetails,
  );
  const courseDetails = usePreferenceStore((state) => state.courseDetails);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleAutoScheduler = useCallback(
    (
      courseDetails: CourseResponse[],
      schedulePreferences: SchedulePreferences,
    ) => {
      async function fetchSchedule() {
        console.log(schedulePreferences);
        const spreadMap: Record<string, number> = {
          "really-spread-out": 10,
          "slightly-spread-out": 8,
          neutral: 6,
          compact: 4,
          "extremely-compact": 2,
        };
        const dayScoreMap: Record<string, { index: number; score: number }> = {
          Su: { index: 0, score: 0 },
          M: { index: 1, score: 6 },
          Tu: { index: 2, score: 9 },
          W: { index: 3, score: 6 },
          Th: { index: 4, score: 9 },
          F: { index: 5, score: 6 },
          Sa: { index: 6, score: 0 },
        };

        function computePreferredDays(selectedDays: string[]): number[] {
          const scores = new Array(7).fill(0);
          for (const day of selectedDays) {
            const mapping = dayScoreMap[day];
            if (mapping) {
              scores[mapping.index] = mapping.score;
            }
          }
          return scores;
        }
        const userPreferences: Preferences = {
          preferredStart: schedulePreferences.preferredStart, // e.g. "09:00"
          preferredEnd: schedulePreferences.preferredEnd, // e.g. "15:00"
          preferredDays: computePreferredDays(
            schedulePreferences.preferredDays,
          ),
          spread: spreadMap[schedulePreferences.spread.toLowerCase()],
          avoidBackToBack: schedulePreferences.avoidBackToBack,
          //blockInstructor: "Watts, Edward J.",
        };
        console.log(userPreferences);
        const availableCourses = await parseAvailableCourses(courseDetails);

        const courses = availableCourses.courses;
        const courseIds: string[] = courses.map((course) => course.id);
        console.log(courseIds);
        const mainSections = availableCourses.mainSection;
        const subSections = availableCourses.subSection;

        const mainSectionMap = await createMainSectionLookup(mainSections);
        const subSectionMap = await createSubSectionLookup(subSections);
        console.log(availableCourses);
        console.log(courseDetails);
        console.log(courseIds);
        const schedules: Schedule[] = await generateOptimalSchedule(
          courseIds,
          userPreferences,
          mainSectionMap,
          subSectionMap,
        );
        if (schedules.length === 0) {
          console.log("No valid schedules found");
          return;
        }

        for (const schedule of schedules) {
          console.log(schedule.classes);
          console.log(schedule.fitness);
        }

        const formattedEvents = schedules.map((schedule: Schedule) =>
          schedule.classes.map((entry: MainSection | SubSection, i) => {
            const isMain = "letter" in entry;

            // If it's a MainSection, grab course directly
            const course = isMain
              ? courses.find((course) => course.id === entry.course_id)
              : courses.find(
                  (course) =>
                    course.id ===
                    mainSections.find(
                      (mainSection) => mainSection.id === entry.main_section_id,
                    )?.course_id,
                );

            const mainSection = isMain
              ? (entry as MainSection)
              : mainSections.find(
                  (mainSection) => mainSection.id === entry.main_section_id,
                );

            const title = `${course?.subject || "?"} ${course?.code || "?"} | ${
              isMain
                ? `Lecture: ${mainSection?.letter}`
                : `Section: ${entry.section} | Lecture: ${mainSection?.letter || "?"}`
            }`;

            return {
              id: (i + 1).toString(),
              title,
              startTime: entry.start_time,
              endTime: entry.end_time,
              daysOfWeek: convertDaysToNumbers(entry.days),
              extendedProps: {
                instructor: mainSection?.instructor || "TBA",
                location: mainSection?.location || "TBD",
                meeting_type: isMain ? "Lecture" : "Section",
              },
            };
          }),
        );

        setEvents(formattedEvents);
      }

      fetchSchedule();
    },
    [],
  );

  useEffect(() => {
    console.log("Updated events:", events);
  }, [events]);

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Course Selection */}
      <Section title="Select Your Courses">
        <div className="w-full flex items-center justify-center gap-4">
          <CourseDropdown className="max-w-[30rem]" courses={allCourses} />
          <Button label="Search" onClick={handleFetchCourseDetails} />
        </div>
      </Section>

      {courseDetails.length > 0 && (
        <>
          {/* Instructor/Section Selection */}
          <Section title="Course List">
            <CourseList />
          </Section>

          {/* Preferences */}
          <Section title="Preferences">
            <PreferencesComponent />
          </Section>

          <Button
            icon={<Calendar />}
            label="Update Schedule"
            className="self-end"
            onClick={() =>
              handleAutoScheduler(courseDetails, schedulePreferences)
            }
          />
        </>
      )}

      {/* Schedule Display */}
      {events.length > 0 && <ScheduleDisplay events={events} />}
    </div>
  );
}
