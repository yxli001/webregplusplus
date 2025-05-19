"use client";

import { getCourseDetails, getCourses, getQuarters } from "@/api/courses";
import {
  createMainSectionByCourseIdLookup,
  createMainSectionByIdLookup,
  createSubSectionByIdLookup,
  createSubSectionByMainSectionIdLookup,
  parseAvailableCourses,
  quarterNameToString,
} from "@/util/helper";
import generateOptimalSchedule from "@/lib/scheduler";
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
import { useCallback, useEffect, useRef, useState } from "react";
import ScheduleDisplay from "@/components/ScheduleDisplay";
import DropdownSelect from "@/components/DropdownSelect";
import { CalEvent, CalSchedule } from "@/types/calendar";
import Pin from "@/icons/Pin";
import PinFill from "@/icons/PinFill";
import { Toast } from "primereact/toast";

interface SectionProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const Section = ({ title, children, className }: SectionProps) => {
  return (
    <div
      className={`flex flex-col rounded-md border border-border bg-foreground`}
    >
      <h1 className="border-b border-border px-5 py-3 text-lg font-bold text-text-dark">
        {title}
      </h1>
      <div className={`w-full p-8 ${className}`}>{children}</div>
    </div>
  );
};

const COLORS: {
  backgroundColor: string;
  textColor: string;
}[] = [
  {
    backgroundColor: "#E3F8FF",
    textColor: "#1992D4",
  },
  {
    backgroundColor: "#FCECF8",
    textColor: "#BB3894",
  },
  {
    backgroundColor: "#EFF7EB",
    textColor: "#45832A",
  },
];

export default function Home() {
  const toast = useRef<Toast>(null);

  const [allQuarters, setAllQuarters] = useState<Quarter[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [algorithmRan, setAlgorithmRan] = useState(false);

  // Generated schedules
  const [schedules, setSchedules] = useState<CalSchedule[]>([]);
  const [currSchedule, setCurrSchedule] = useState<CalSchedule | null>();

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
        selectedCourses.map((course) => `${course.subject}+${course.code}`),
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
    setSchedules([]);
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
        const availableCourses = await parseAvailableCourses(
          courseDetails,
          coursePreferences,
        );

        const courses = availableCourses.courses;
        const courseIds: string[] = courses.map((course) => course.id!);
        const mainSections = availableCourses.mainSection;
        const subSections = availableCourses.subSection;

        const mainSectionByCourseIdMap =
          await createMainSectionByCourseIdLookup(mainSections);
        const subSectionByMainSectionIdMap =
          await createSubSectionByMainSectionIdLookup(subSections);
        const mainSectionByIdMap =
          await createMainSectionByIdLookup(mainSections);
        const subSectionByIdMap = await createSubSectionByIdLookup(subSections);

        const schedules = await generateOptimalSchedule(
          courseIds,
          schedulePreferences,
          mainSectionByCourseIdMap,
          subSectionByMainSectionIdMap,
          mainSectionByIdMap,
          subSectionByIdMap,
        );

        setAlgorithmRan(true);

        if (schedules.length === 0) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning",
            detail:
              "No valid schedules found. Please try again with different preferences.",
            life: 2000,
          });
          return;
        }

        const formattedEvents: CalSchedule[] = schedules.map(
          (schedule, index) => {
            const events = schedule.classes.map(
              (entry: MainSection | SubSection, i) => {
                const isMain = "letter" in entry;

                // If it's a MainSection, grab course directly
                const course = isMain
                  ? courses.find((course) => course.id === entry.courseId)
                  : courses.find(
                      (course) =>
                        course.id ===
                        mainSections.find(
                          (mainSection) =>
                            mainSection.id === entry.mainSectionId,
                        )?.courseId,
                    );

                const mainSection = isMain
                  ? (entry as MainSection)
                  : mainSections.find(
                      (mainSection) => mainSection.id === entry.mainSectionId,
                    );

                const title = `${course?.subject || "?"} ${course?.code}`;

                return {
                  id: `${index}-${i}`,
                  title,
                  startTime: entry.startTime,
                  endTime: entry.endTime,
                  daysOfWeek: convertDaysToNumbers(entry.days),
                  extendedProps: {
                    lecture: isMain ? entry.letter : mainSection?.letter,
                    section: isMain ? "00" : entry.section,
                    instructor: isMain
                      ? entry.instructor
                      : mainSection?.instructor,
                    location: entry.location || "TBD",
                    meetingType: entry.type,
                  },
                } as CalEvent;
              },
            );

            return {
              id: index + 1,
              pinned: false,
              events,
              backgroundColor: COLORS[0].backgroundColor,
              textColor: COLORS[0].textColor,
            } as CalSchedule;
          },
        );

        // Apply colors to the schedules before setting them
        const coloredSchedules = updateScheduleColors(formattedEvents);
        setSchedules(coloredSchedules);
        setCurrSchedule(coloredSchedules[0]);
      }

      fetchSchedule();
    },
    [],
  );

  // Function to update schedule colors
  const updateScheduleColors = useCallback(
    (schedulesToUpdate: CalSchedule[]) => {
      if (schedulesToUpdate.length > 0) {
        const pinned = schedulesToUpdate
          .filter((schedule) => schedule.pinned)
          .map((schedule, index) => {
            return {
              ...schedule,
              backgroundColor: COLORS[index].backgroundColor,
              textColor: COLORS[index].textColor,
            };
          })
          .sort((a, b) => a.id - b.id);

        const unpinned = schedulesToUpdate
          .filter((schedule) => !schedule.pinned)
          .sort((a, b) => a.id - b.id)
          .map((schedule) => {
            if (currSchedule && currSchedule.id == schedule.id) {
              return {
                ...schedule,
                backgroundColor: currSchedule.backgroundColor,
                textColor: currSchedule.textColor,
              };
            }

            return schedule;
          });

        return [...pinned, ...unpinned];
      }

      return schedulesToUpdate;
    },
    [currSchedule],
  );

  const getEvents = useCallback(() => {
    let res: CalEvent[] = [];

    const pinned = schedules.filter((schedule) => schedule.pinned);

    // Add pinned events with their colors
    const pinnedEvents = pinned
      .map((schedule) =>
        schedule.events.map((event) => {
          return {
            ...event,
            backgroundColor: schedule.backgroundColor,
            textColor: schedule.textColor,
          };
        }),
      )
      .flat();

    res = [...pinnedEvents];

    if (currSchedule) {
      const currEvents = currSchedule.events.map((event) => {
        return {
          ...event,
          backgroundColor: currSchedule.backgroundColor,
          textColor: currSchedule.textColor,
        };
      });

      res = [...res, ...currEvents];
    }

    return res;
  }, [schedules, currSchedule]);

  return (
    <div className="flex w-full flex-col gap-10">
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
            <div className="flex w-full items-center justify-center gap-4">
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
                  handleAutoScheduler(courseDetails, coursePreferences, {
                    ...schedulePreferences,
                    allowedConflicts: new Set([
                      "87076c92-9f02-44fc-9d09-18d93ddd17c4",
                      "1a5bf273-1eee-4168-b9d5-418641029fb8",
                      "481a6a23-b0db-4ec0-b7b3-1d41f9082298",
                    ]),
                  })
                }
              />
            </>
          )}

          {/* Schedule Display */}
          {algorithmRan && schedules.length > 0 && (
            <Section title="Possible Schedules" className="flex flex-col gap-4">
              <div className="flex w-full flex-wrap gap-4 rounded-md border border-border p-2">
                {schedules.map((curr) => (
                  <div
                    key={curr.id}
                    className="flex items-center rounded-md text-[16px] font-semibold hover:cursor-pointer"
                    style={{
                      backgroundColor: curr.pinned
                        ? curr.backgroundColor
                        : currSchedule && currSchedule.id == curr.id
                          ? currSchedule.backgroundColor
                            ? currSchedule.backgroundColor
                            : "#E3F8FF"
                          : "#F6F6F6",
                      color: curr.pinned
                        ? curr.textColor
                        : currSchedule && currSchedule.id == curr.id
                          ? currSchedule.textColor
                            ? currSchedule.textColor
                            : "#1992D4"
                          : "#627D98",
                    }}
                  >
                    <div
                      className="py-2 pl-3"
                      onClick={() => {
                        if (!curr.pinned) {
                          setCurrSchedule({
                            ...curr,
                            backgroundColor:
                              COLORS[
                                Math.min(
                                  schedules.filter(
                                    (schedule) => schedule.pinned,
                                  ).length,
                                  COLORS.length - 1,
                                )
                              ].backgroundColor,
                            textColor:
                              COLORS[
                                Math.min(
                                  schedules.filter(
                                    (schedule) => schedule.pinned,
                                  ).length,
                                  COLORS.length - 1,
                                )
                              ].textColor,
                          });
                        }
                      }}
                    >{`Option ${curr.id}`}</div>
                    <div
                      className="py-2 pl-2 pr-3"
                      onClick={() => {
                        const newSchedules = schedules.map((schedule) => {
                          if (schedule.id === curr.id) {
                            return {
                              ...schedule,
                              pinned: !schedule.pinned,
                            };
                          }
                          return schedule;
                        });

                        const pinned = newSchedules.filter(
                          (schedule) => schedule.pinned,
                        );

                        if (pinned.length === COLORS.length) {
                          toast.current?.show({
                            severity: "info",
                            summary: "Info",
                            detail:
                              "You can only pin up to 2 schedules. Please unpin one before pinning another.",
                            life: 2000,
                          });

                          return;
                        }

                        // Apply colors and update schedules
                        const coloredSchedules =
                          updateScheduleColors(newSchedules);

                        setSchedules(coloredSchedules);
                        setCurrSchedule(null);
                      }}
                    >
                      {curr.pinned ? (
                        <PinFill
                          className="h-full"
                          size={24}
                          color={
                            curr.pinned
                              ? curr.textColor
                              : currSchedule && currSchedule.id == curr.id
                                ? currSchedule.textColor
                                  ? currSchedule.textColor
                                  : "#1992D4"
                                : "#627D98"
                          }
                        />
                      ) : (
                        <Pin
                          className="h-full"
                          size={24}
                          color={
                            curr.pinned
                              ? curr.textColor
                              : currSchedule && currSchedule.id == curr.id
                                ? currSchedule.textColor
                                  ? currSchedule.textColor
                                  : "#1992D4"
                                : "#627D98"
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <ScheduleDisplay events={getEvents()} />
            </Section>
          )}
          <Toast
            ref={toast}
            pt={{
              content: {
                className: "flex p-3 gap-4",
              },
              icon: {
                className: "mt-1",
              },
            }}
          />
        </>
      )}
    </div>
  );
}
