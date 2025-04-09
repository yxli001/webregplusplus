"use client"; // Ensure it's a client component

import FullCalendar from "@fullcalendar/react";
// import {
//   createMainSectionLookup,
//   createSubSectionLookup,
//   parseAvailableCourses,
// } from "../app/util/helper";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
// import { useEffect, useState } from "react";
// import generateOptimalSchedule from "@/app/lib/scheduler";
// import { convertDaysToNumbers } from "../app/util/helper";
// import {
//   MainSection,
//   Preferences,
//   Schedule,
//   SubSection,
// } from "../app/types/interfaces_api";

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

interface ScheduleDisplayProps {
  events: Event[][];
}

export default function ScheduleDisplay({ events }: ScheduleDisplayProps) {
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
