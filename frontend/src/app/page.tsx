"use client";

import { getCourseDetails, getCourses, getQuarters } from "@/api/courses";
import {
  createMainSectionLookup,
  createSubSectionLookup,
  parseAvailableCourses,
  quarterNameToString,
} from "@/util/helper";
import generateOptimalSchedule, { Schedule } from "@/lib/scheduler";
import { convertDaysToNumbers } from "@/util/helper";
import Button from "@/components/Button";
import CourseDropdown from "@/components/CourseDropdown";
import CourseList from "@/components/CourseList";
import PreferencesComponent from "@/components/Preferences";
import Calendar from "@/icons/Calendar";
import {
  CoursePreferences,
  SchedulePreferences,
  usePreferenceStore,
} from "@/store/preferenceStore";
import {
  Course,
  CourseWithSections,
  MainSection,
  Quarter,
  SubSection,
} from "@/types/course";
import { useCallback, useEffect, useState } from "react";
import ScheduleDisplay from "@/components/ScheduleDisplay";
import DropdownSelect from "@/components/DropdownSelect";

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
  const [allQuarters, setAllQuarters] = useState<Quarter[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [algorithmRan, setAlgorithmRan] = useState(false);
  const [events, setEvents] = useState<Event[][]>([]);

  const selectedCourses = usePreferenceStore((state) => state.selectedCourses);
  const setSelectedCourses = usePreferenceStore(
    (state) => state.setSelectedCourses,
  );
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
        selectedQuarter,
        selectedCourses.map((course) => `${course.subject} ${course.code}`),
      );

      if (res.success) {
        setCourseDetails(res.data);
      }
    };

    fetchDetails();
  };

  useEffect(() => {
    const fetchQuarters = async () => {
      const res = await getQuarters();

      if (res.success) {
        setAllQuarters(res.data);
      }
    };

    fetchQuarters();
  }, []);

  useEffect(() => {
    setSelectedCourses([]);
    setCourseDetails([]);
    setEvents([]);
    setAlgorithmRan(false);

    const fetchCourses = async () => {
      if (selectedQuarter) {
        const res = await getCourses(selectedQuarter);

        if (res.success) {
          setAllCourses(res.data);
        }
      }
    };

    fetchCourses();
  }, [selectedQuarter]);

  const handleAutoScheduler = useCallback(
    (
      courseDetails: CourseWithSections[],
      coursePreferences: CoursePreferences[],
      schedulePreferences: SchedulePreferences,
    ) => {
      async function fetchSchedule() {
        console.log(coursePreferences);
        console.log(schedulePreferences);

        const availableCourses = await parseAvailableCourses(
          courseDetails,
          coursePreferences,
        );

        const courses = availableCourses.courses;
        const courseIds: string[] = courses.map((course) => course.id!);
        const mainSections = availableCourses.mainSection;
        const subSections = availableCourses.subSection;

        const mainSectionMap = await createMainSectionLookup(mainSections);
        const subSectionMap = await createSubSectionLookup(subSections);
        const schedules: Schedule[] = await generateOptimalSchedule(
          courseIds,
          schedulePreferences,
          mainSectionMap,
          subSectionMap,
        );
        setAlgorithmRan(true);

        if (schedules.length === 0) {
          alert("No valid schedules found. Please adjust your preferences.");
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
              ? courses.find((course) => course.id === entry.courseId)
              : courses.find(
                  (course) =>
                    course.id ===
                    mainSections.find(
                      (mainSection) => mainSection.id === entry.mainSectionId,
                    )?.courseId,
                );

            const mainSection = isMain
              ? (entry as MainSection)
              : mainSections.find(
                  (mainSection) => mainSection.id === entry.mainSectionId,
                );

            const title = `${course?.subject || "?"} ${course?.code || "?"} | ${
              isMain
                ? `Lecture: ${mainSection?.letter}`
                : `Section: ${entry.section} | Lecture: ${mainSection?.letter || "?"}`
            }`;

            return {
              id: (i + 1).toString(),
              title,
              startTime: entry.startTime,
              endTime: entry.endTime,
              daysOfWeek: convertDaysToNumbers(entry.days),
              extendedProps: {
                instructor: mainSection?.instructor || "TBA",
                location: isMain
                  ? mainSection?.location
                  : entry?.location || "TBD",
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
      {/* Quarter Selection */}
      <Section title="Select a quarter">
        <DropdownSelect
          options={allQuarters.map((quarter) => ({
            label: quarterNameToString(quarter.name),
            value: quarter.name,
          }))}
          value={selectedQuarter}
          onChange={(value) => {
            setSelectedQuarter(value);
          }}
          closeOnSelect
        />
      </Section>

      {selectedQuarter && (
        <>
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
                  handleAutoScheduler(
                    courseDetails,
                    coursePreferences,
                    schedulePreferences,
                  )
                }
              />
            </>
          )}

          {/* Schedule Display */}
          {algorithmRan && <ScheduleDisplay events={events} />}
        </>
      )}
    </div>
  );
}
