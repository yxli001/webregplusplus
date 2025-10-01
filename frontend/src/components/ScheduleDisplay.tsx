"use client"; // Ensure it's a client component

import { DateSelectArg } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";

import PreferredDayStar from "@/components/inputs/Star";
import { usePreferenceStore } from "@/hooks/usePreferenceStore";
import { CalEvent } from "@/types/calendar";

type ScheduleDisplayProps = {
  events: CalEvent[];
  selectable?: boolean;
};

export default function ScheduleDisplay({
  events,
  selectable = false,
}: ScheduleDisplayProps) {
  const calRef = useRef<FullCalendar | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const excludedTimeslots = usePreferenceStore(
    (state) => state.schedulePreferences.excludedTimeSlots,
  );
  const addExcludedTimeSlot = usePreferenceStore(
    (state) => state.addExcludedTimeSlot,
  );
  const removeExcludedTimeSlot = usePreferenceStore(
    (state) => state.removeExcludedTimeSlot,
  );

  // Resize observer to adjust calendar size based on wrapper dimensions
  useEffect(() => {
    const ro = new ResizeObserver(() => calRef.current?.getApi().updateSize());
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => {
      ro.disconnect();
    };
  }, []);

  const onSelect = (arg: DateSelectArg) => {
    const startTime = arg.start.toTimeString().slice(0, 5); // HH:MM format
    const endTime = arg.end.toTimeString().slice(0, 5); // HH:MM format

    const newSlot = {
      id: `slot-${excludedTimeslots.length}`,
      day: arg.start.getDay(),
      startTime,
      endTime,
    };

    addExcludedTimeSlot(newSlot);
  };

  const excludedEvents = useMemo(() => {
    return excludedTimeslots.map(
      (slot) =>
        ({
          id: slot.id,
          title: "Blocked",
          daysOfWeek: [slot.day],
          startTime: slot.startTime,
          endTime: slot.endTime,
          backgroundColor: "#00000079",
          borderColor: "#ffcccc",
          textColor: "#ffffff",
          extendedProps: {
            deletable: true,
            onDelete: (id: string) => {
              removeExcludedTimeSlot(id);
            },
          },
        }) as CalEvent,
    );
  }, [excludedTimeslots]);

  const TOKENS = ["M", "Tu", "W", "Th", "F"];
  const preferredDays = usePreferenceStore(
    (s) => s.schedulePreferences.preferredDays ?? [],
  );
  const updateSchedulePreferences = usePreferenceStore(
    (s) => s.updateSchedulePreferences,
  );

  return (
    <div ref={wrapperRef} className="mx-auto mt-5 h-full w-full">
      <FullCalendar
        ref={calRef}
        viewClassNames={twMerge("w-full", selectable && "cursor-row-resize")}
        dayHeaderClassNames="!py-[0.3rem]"
        slotLabelClassNames="uppercase !px-[0.5rem]"
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        firstDay={1} // 0 = Sunday, 1 = Monday
        slotLabelFormat={{
          hour: "numeric",
          hour12: true,
        }}
        dayHeaderFormat={{ weekday: "short" }}
        dayHeaderContent={(arg) => {
          const js = arg.date.getDay();
          if (js < 1 || js > 5) return arg.text;
          const idx = js - 1;
          const token = TOKENS[idx];
          const isOn = preferredDays.includes(token);

          return (
            <span className="group inline-flex items-center gap-1">
              <PreferredDayStar
                active={isOn}
                onClick={() => {
                  const next = isOn
                    ? preferredDays.filter((d) => d !== token)
                    : [...preferredDays, token];
                  updateSchedulePreferences({ preferredDays: next });
                }}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              />
              <span className="inline-flex items-center">{arg.text}</span>
            </span>
          );
        }}
        hiddenDays={[0, 6]} // Hide Sunday and Saturday
        headerToolbar={false}
        events={[...events, ...excludedEvents]}
        selectable={selectable}
        select={onSelect}
        snapDuration="00:30:00"
        selectConstraint={{
          startTime: "08:00:00",
          endTime: "22:00:00",
        }}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
        height="auto"
        expandRows={true}
        nowIndicator={false}
        allDaySlot={false}
        eventContent={(eventInfo) => {
          const {
            title,
            extendedProps,
            backgroundColor,
            borderColor,
            textColor,
          } = eventInfo.event;
          return (
            <div
              className={twMerge(
                "relative flex h-full rounded-md border px-[5px] py-[5px] text-xs",
                borderColor ? `border-[${borderColor}]` : "border-[#B2DDFF]",
                textColor ? `text-[${textColor}]` : "text-[#B2DDFF]",
                extendedProps.deletable
                  ? "transition-all hover:cursor-pointer hover:ring-2 hover:ring-red-400"
                  : "",
              )}
              style={{
                backgroundColor: backgroundColor || "#e3f8ff",
              }}
              title={extendedProps.deletable ? "Click to delete" : undefined}
              onClick={() => {
                if (extendedProps.deletable) {
                  extendedProps.onDelete(eventInfo.event.id);
                }
              }}
            >
              <div className="flex flex-col items-start gap-1 overflow-hidden whitespace-nowrap leading-[1.2]">
                <div className="truncate font-semibold">{title}</div>
                {extendedProps.lecture && (
                  <span className="truncate font-normal">
                    {extendedProps.lecture}
                    {extendedProps.section} / {extendedProps.meetingType}
                  </span>
                )}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
