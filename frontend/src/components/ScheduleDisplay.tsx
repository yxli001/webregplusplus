"use client"; // Ensure it's a client component

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef } from "react";

import { CalEvent } from "@/types/calendar";

type ScheduleDisplayProps = {
  events: CalEvent[];
};

export default function ScheduleDisplay({ events }: ScheduleDisplayProps) {
  const calRef = useRef<FullCalendar | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // Resize observer to adjust calendar size based on wrapper dimensions
  useEffect(() => {
    const ro = new ResizeObserver(() => calRef.current?.getApi().updateSize());
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="mx-auto h-full w-full p-4">
      <FullCalendar
        ref={calRef}
        viewClassNames="w-full"
        dayHeaderClassNames="!py-[0.3rem]"
        slotLabelClassNames="uppercase !px-[0.5rem]"
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        firstDay={1} // 0 = Sunday, 1 = Monday
        slotLabelFormat={{
          hour: "numeric",
          hour12: true,
        }}
        dayHeaderFormat={{ weekday: "short" }}
        hiddenDays={[0, 6]} // Hide Sunday and Saturday
        headerToolbar={false}
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
        height="auto"
        expandRows={true}
        nowIndicator={false}
        allDaySlot={false}
        eventContent={(eventInfo) => {
          const { title, extendedProps, backgroundColor, textColor } =
            eventInfo.event;
          return (
            <div
              className={`flex items-center px-[4px] py-[6px] text-[0.5rem]`}
              style={{
                backgroundColor: backgroundColor ? backgroundColor : "#e3f8ff",
                color: textColor ? textColor : "#1992d4",
              }}
            >
              {/* Colored left bar */}
              <div
                className={`mr-[6px] h-full w-[2.5px] flex-shrink-0 rounded-md`}
                style={{
                  backgroundColor: textColor ? textColor : "#1992D4",
                }}
              ></div>
              {/* Text content */}
              <div className="leading-[1.2]">
                <div className="text-[0.6rem] font-semibold">{title}</div>
                <span className="font-semibold">
                  {extendedProps.lecture}
                  {extendedProps.section} / {extendedProps.meetingType}
                </span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
