"use client"; // Ensure it's a client component

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import generateOptimalSchedule from "@/app/lib/scheduler";
import {
  Lecture,
  Preferences,
  Schedule,
  Section,
} from "@/app/types/interfaces";
import { convertDaysToNumbers } from "../util/helper";

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
        preferredStart: "12:00", // e.g. "09:00"
        preferredEnd: "18:00", // e.g. "15:00"
        preferredDays: [0, 6, 0, 6, 0, 6, 0],
        spread: 9,
        avoidBackToBack: false,
      };
      const schedules: Schedule[] = await generateOptimalSchedule(
        [1, 2, 4],
        userPreferences,
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
        schedule.classes.map((entry: Lecture | Section, i) => ({
          id: (i + 1).toString(),
          title:
            "lecture_letter" in entry
              ? `Lecture: ${entry.lecture_letter}`
              : `Section: ${entry.section_id} Lecture: ${entry.lecture_id}`,
          startTime: `${entry.start_time}`,
          endTime: `${entry.end_time}`,
          daysOfWeek: convertDaysToNumbers(entry.days),
          extendedProps: {
            instructor: "instructor" in entry ? entry.instructor : undefined,
            location: entry.location,
            meeting_type: "lecture_letter" in entry ? "Lecture" : "Section",
          },
        })),
      );
      setEvents(formattedEvents);
    }

    fetchSchedule();
  }, []);
  console.log(events[0]);
  return (
    <div
    //   style={{
    //     height: "100vh",
    //     width: "75vw",
    //     justifyContent: "center",
    //     justifyItems: "center",
    //      }}
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
        expandRows={true}
        eventContent={(eventInfo) => (
          <div style={{ height: "100%", padding: "8px", whiteSpace: "normal" }}>
            <strong>{eventInfo.event.title}</strong>
            <br />
            <span>{eventInfo.event.extendedProps?.instructor}</span>
            <br />
            <span>Room: {eventInfo.event.extendedProps?.location}</span>
          </div>
        )}
      />
    </div>
  );
}
