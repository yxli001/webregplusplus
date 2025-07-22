"use client";
import { Calendar, Upload } from "lucide-react";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";

import CourseList from "@/components/CourseList";
import ScheduleDisplay from "@/components/ScheduleDisplay";
import Dropdown from "@/components/dropdown/Dropdown";
import Pin from "@/components/icons/Pin";
import ButtonGroup from "@/components/inputs/ButtonGroup";
import CourseDropdown from "@/components/inputs/CourseDropdown";
import ThreePane from "@/components/layouts/ThreePane";
import { usePreferenceStore } from "@/hooks/usePreferenceStore";
import { useScheduleStore } from "@/hooks/useScheduleStore";
import { scheduleColors } from "@/lib/constants";
import generateOptimalSchedule from "@/lib/scheduler";
import {
  CoursePreferences,
  SchedulePreferences,
} from "@/store/preferenceStore";
import { CalEvent, CalSchedule } from "@/types/calendar";
import { CourseWithSections, MainSection, SubSection } from "@/types/course";
import {
  convertDaysToNumbers,
  createMainSectionByCourseIdLookup,
  createMainSectionByIdLookup,
  createSubSectionByIdLookup,
  createSubSectionByMainSectionIdLookup,
  parseAvailableCourses,
} from "@/util/helper";

export default function Home() {
  const toast = useRef<Toast>(null);

  // Preferences
  const courseDetails = usePreferenceStore((state) => state.courseDetails);
  const coursePreferences = usePreferenceStore(
    (state) => state.coursePreferences,
  );
  const schedulePreferences = usePreferenceStore(
    (state) => state.schedulePreferences,
  );

  // Schedules states
  const schedules = useScheduleStore((state) => state.schedules);
  const setSchedules = useScheduleStore((state) => state.setSchedules);
  const currSchedule = useScheduleStore((state) => state.currSchedule);
  const setCurrSchedule = useScheduleStore((state) => state.setCurrSchedule);

  const [activeTab, setActiveTab] = useState<"calendar" | "finals" | "list">(
    "calendar",
  );

  // Helper functions
  const updateScheduleColors = useCallback(
    (schedulesToUpdate: CalSchedule[]) => {
      if (schedulesToUpdate.length > 0) {
        const pinned = schedulesToUpdate
          .filter((schedule) => schedule.pinned)
          .map((schedule, index) => {
            return {
              ...schedule,
              backgroundColor: scheduleColors[index].backgroundColor,
              textColor: scheduleColors[index].textColor,
              borderColor: scheduleColors[index].borderColor,
            };
          })
          .sort((a, b) => a.id - b.id);

        const unpinned = schedulesToUpdate
          .filter((schedule) => !schedule.pinned)
          .sort((a, b) => a.id - b.id)
          .map((schedule) => {
            if (currSchedule && currSchedule.id === schedule.id) {
              return {
                ...schedule,
                backgroundColor: currSchedule.backgroundColor,
                borderColor: currSchedule.borderColor,
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
            borderColor: schedule.borderColor,
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
          borderColor: currSchedule.borderColor,
        };
      });

      res = [...res, ...currEvents];
    }

    return res;
  }, [schedules, currSchedule]);

  // Event handlers
  const handleAutoScheduler = (
    cDetails: CourseWithSections[],
    cPreferences: CoursePreferences[],
    sPreferences: SchedulePreferences,
  ) => {
    // Don't run if no courses or preferences are set
    if (cDetails.length === 0 || cPreferences.length === 0) {
      setSchedules([]);
      setCurrSchedule(null);
      return;
    }

    const fetchSchedule = () => {
      const availableCourses = parseAvailableCourses(cDetails, cPreferences);

      const courses = availableCourses.courses;
      const courseIds: string[] = courses.map((course) => course.id);
      const mainSections = availableCourses.mainSection;
      const subSections = availableCourses.subSection;

      const mainSectionByCourseIdMap =
        createMainSectionByCourseIdLookup(mainSections);
      const subSectionByMainSectionIdMap =
        createSubSectionByMainSectionIdLookup(subSections);
      const mainSectionByIdMap = createMainSectionByIdLookup(mainSections);
      const subSectionByIdMap = createSubSectionByIdLookup(subSections);

      const scheds = generateOptimalSchedule(
        courseIds,
        sPreferences,
        mainSectionByCourseIdMap,
        subSectionByMainSectionIdMap,
        mainSectionByIdMap,
        subSectionByIdMap,
      );

      const includedCourses = cPreferences.filter((course) => course.included);
      if (includedCourses.length > 0 && scheds.length === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail:
            "No valid schedules found. Please try again with different preferences.",
          life: 2000,
        });
        return;
      }

      const formattedEvents: CalSchedule[] = scheds.map((schedule, index) => {
        const events = schedule.classes.map(
          (entry: MainSection | SubSection, i) => {
            const isMain = "letter" in entry;

            // If it's a MainSection, grab course directly
            const course = isMain
              ? courses.find((c) => c.id === entry.courseId)
              : courses.find(
                  (c) =>
                    c.id ===
                    mainSections.find(
                      (mainSection) => mainSection.id === entry.mainSectionId,
                    )?.courseId,
                );

            const mainSection = isMain
              ? entry
              : mainSections.find((ms) => ms.id === entry.mainSectionId);

            const title = `${course?.subject ?? "?"} ${course?.code}`;

            return {
              id: `${index}-${i}`,
              title,
              startTime: entry.startTime,
              endTime: entry.endTime,
              daysOfWeek: convertDaysToNumbers(entry.days),
              extendedProps: {
                lecture: isMain ? entry.letter : mainSection?.letter,
                section: isMain ? "00" : entry.section,
                instructor: isMain ? entry.instructor : mainSection?.instructor,
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
          backgroundColor: scheduleColors[0].backgroundColor,
          textColor: scheduleColors[0].textColor,
          borderColor: scheduleColors[0].borderColor,
        } as CalSchedule;
      });

      // Apply colors to the schedules before setting them
      const coloredSchedules = updateScheduleColors(formattedEvents);
      setSchedules(coloredSchedules);
      setCurrSchedule(coloredSchedules[0]);
    };

    fetchSchedule();
  };

  useEffect(() => {
    console.log(coursePreferences);
    handleAutoScheduler(courseDetails, coursePreferences, schedulePreferences);
  }, [courseDetails, coursePreferences, schedulePreferences]);

  return (
    <>
      <ThreePane
        left={
          <aside className="flex flex-col gap-6 p-6">
            <CourseDropdown maxCourses={10} />
            <CourseList />
          </aside>
        }
        center={
          <main className="flex h-full w-full flex-col items-end p-6">
            <ButtonGroup
              className="flex"
              buttons={[
                {
                  label: "Calendar",
                  active: activeTab === "calendar",
                  onClick: () => {
                    setActiveTab("calendar");
                  },
                },
                {
                  label: "Finals",
                  active: activeTab === "finals",
                  onClick: () => {
                    setActiveTab("finals");
                  },
                },
                {
                  label: "List",
                  active: activeTab === "list",
                  onClick: () => {
                    setActiveTab("list");
                  },
                },
              ]}
            />
            {activeTab === "calendar" && (
              <ScheduleDisplay events={getEvents()} />
            )}
            {activeTab === "finals" && <ScheduleDisplay events={getEvents()} />}
            {activeTab === "list" && <ScheduleDisplay events={[]} />}
          </main>
        }
        right={
          <aside className="flex flex-col gap-6 p-6">
            <Dropdown
              value="sched1"
              title="Schedule 1"
              icon={<Calendar size={16} />}
              actions={[
                { icon: <Pin size={16} /> },
                { icon: <Upload size={16} /> },
              ]}
              defaultOpen
            >
              <div>test</div>
            </Dropdown>
          </aside>
        }
      />
      <Toast ref={toast} />
    </>
  );
}
