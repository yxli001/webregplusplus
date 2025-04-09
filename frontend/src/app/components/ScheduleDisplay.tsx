"use client"; // Ensure it's a client component

import FullCalendar from "@fullcalendar/react";
import {
  createMainSectionLookup,
  createSubSectionLookup,
  parseAvailableCourses,
} from "../util/helper";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import generateOptimalSchedule from "@/app/lib/scheduler";
import { convertDaysToNumbers } from "../util/helper";
import {
  MainSection,
  Preferences,
  Schedule,
  SubSection,
} from "../types/interfaces_api";

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

export default function ScheduleDisplay() {
  const [events, setEvents] = useState<Event[][]>([]);
  useEffect(() => {
    async function fetchSchedule() {
      const userPreferences: Preferences = {
        preferredStart: "10:00", // e.g. "09:00"
        preferredEnd: "18:00", // e.g. "15:00"
        preferredDays: [0, 6, 0, 6, 0, 6, 0],
        spread: 9,
        avoidBackToBack: false,
        blockInstructor: "Watts, Edward J.",
      };
      const courseDetailResponse = await fetch(
        `http://localhost:3001/api/course/details?courses=MATH 11,CSE 11,CSE 8A,HUM 2`,
      );
      const courseDetailData = await courseDetailResponse.json();
      const availableCourses = await parseAvailableCourses(courseDetailData);
      const courses = availableCourses.courses;
      const mainSections = availableCourses.mainSection;
      const subSections = availableCourses.subSection;

      const mainSectionMap = await createMainSectionLookup(mainSections);
      const subSectionMap = await createSubSectionLookup(subSections);
      const schedules: Schedule[] = await generateOptimalSchedule(
        [
          "108abd7b-f43e-4ef4-b091-8fd98b7fd6d5",
          "0ed1778b-46f1-4813-937b-31c2de880018",
          "aa106861-5a5c-4b8a-bac4-de68f1d307ac",
          "49303c03-7df6-4ba5-a9d9-ecfd2da278ea",
        ],
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
      console.log(mainSectionMap);

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
  }, []);
  console.log(events[0]);
  return (
    <div
      style={{
        width: "100%", // take full width or set a max if desired
        maxWidth: "1000px", // optional for nice centering
        margin: "0 auto", // center horizontally
      }}
    >
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events[0]}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        height="auto"
        expandRows={true} // ✨ ensures rows fill vertical space
        nowIndicator={false} // Disable the current time indicator
        eventContent={(eventInfo) => {
          const { title, extendedProps } = eventInfo.event;
          return (
            <div
              style={{
                padding: "4px",
                fontSize: "0.8rem",
                color: "white",
                lineHeight: "1.2",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{title}</div>
              <div>{extendedProps.instructor}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                Room: {extendedProps.location}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
