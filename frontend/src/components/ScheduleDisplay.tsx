"use client"; // Ensure it's a client component

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Event } from "@/types/calendar";

interface ScheduleDisplayProps {
  events: Event[][];
}

export default function ScheduleDisplay({ events }: ScheduleDisplayProps) {
  return (
    <div className="w-full mx-auto">
      <FullCalendar
        viewClassNames="w-full"
        dayHeaderClassNames="!py-[0.3rem]"
        slotLabelClassNames="uppercase !px-[0.5rem]"
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        firstDay={1} // 0 = Sunday, 1 = Monday
        dayHeaderFormat={{ weekday: "long" }} // Only show "Mon", "Tue", etc.
        hiddenDays={[0, 6]}
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
            <div className="flex items-center h-full overflow-x-hidden px-[4px] py-[6px] text-[0.5rem] bg-[#e3f8ff] text-[#1992d4]">
              {/* Colored left bar */}
              <div
                className={`h-full w-[2.5px] flex-shrink-0 rounded-md ${backgroundColor ? `bg-[${backgroundColor}]` : "bg-[#1992D4]"} mr-[6px]`}
              ></div>

              {/* Text content */}
              <div className="leading-[1.2]">
                <div className="font-semibold text-[0.6rem]">
                  {title} |{" "}
                  <span className="font-semibold">
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
