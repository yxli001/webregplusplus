"use client"; // Ensure it's a client component

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  daysOfWeek?: number[];
  extendedProps?: {
    lecture?: string;
    section?: string;
    meetingType?: string;
    instructor?: string;
    location?: string;
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
        firstDay={1} // 0 = Sunday, 1 = Monday
        dayHeaderFormat={{ weekday: "long" }} // Only show "Mon", "Tue", etc.
        headerToolbar={false}
        events={events[0]}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
        height="auto"
        expandRows={true}
        nowIndicator={false}
        allDaySlot={false}
        eventContent={(eventInfo) => {
          const { title, extendedProps, backgroundColor } = eventInfo.event;
          return (
            <div className="event-box">
              {/* Colored left bar */}
              <div
                style={{
                  width: "2.5px",
                  flexShrink: "0" /* prevents flex from compressing it */,
                  height: "80%",
                  borderRadius: "4px",
                  backgroundColor: backgroundColor || "#1992D4",
                  marginRight: "6px",
                }}
              ></div>

              {/* Text content */}
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600, fontSize: "0.6rem" }}>
                  {title} |{" "}
                  <span style={{ fontWeight: 600 }}>
                    {extendedProps.lecture}
                    {extendedProps.section} / {extendedProps.meetingType}
                  </span>
                </div>
                <div>{extendedProps.instructor}</div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
