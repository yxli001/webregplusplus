import { Calendar, Upload } from "lucide-react";
import { useCallback, useMemo } from "react";

import Dropdown from "./dropdown/Dropdown";
import Pin from "./icons/Pin";

import { useScheduleStore } from "@/hooks/useScheduleStore";
import { maxPinnedSchedules, scheduleColors } from "@/lib/constants";
import { CalSchedule } from "@/types/calendar";

type ScheduleCardProps = {
  schedule: CalSchedule;
  index: number;
  updateScheduleColors: (schedulesToUpdate: CalSchedule[]) => CalSchedule[];
  showToast: (detail: string) => void;
};

export default function ScheduleCard({
  schedule,
  index,
  updateScheduleColors,
  showToast,
}: ScheduleCardProps) {
  const schedules = useScheduleStore((s) => s.schedules);
  const setSchedules = useScheduleStore((s) => s.setSchedules);
  const currSchedule = useScheduleStore((s) => s.currSchedule);
  const setCurrSchedule = useScheduleStore((s) => s.setCurrSchedule);

  const handleScheduleClick = useCallback(
    (sched: CalSchedule) => {
      if (sched.pinned) return;
      const colorIndex = Math.min(
        schedules.filter((s) => s.pinned).length,
        scheduleColors.length - 1,
      );
      setCurrSchedule({
        ...sched,
        backgroundColor: scheduleColors[colorIndex].backgroundColor,
        textColor: scheduleColors[colorIndex].textColor,
        borderColor: scheduleColors[colorIndex].backgroundColor,
      });
    },
    [schedules, setCurrSchedule],
  );

  const handlePinClick = useCallback(
    (sched: CalSchedule) => {
      const toggled = schedules.map((s) =>
        s.id === sched.id ? { ...s, pinned: !s.pinned } : s,
      );
      const pinned = toggled.filter((s) => s.pinned);
      if (pinned.length === maxPinnedSchedules + 1) {
        showToast(
          `You can only pin up to ${maxPinnedSchedules} schedules. Please unpin one before pinning another.`,
        );
        return;
      }
      const colored = updateScheduleColors(toggled);
      setSchedules(colored);
      setCurrSchedule(null);
    },
    [schedules, setSchedules, setCurrSchedule, showToast, updateScheduleColors],
  );

  const cardStyle =
    currSchedule && schedule.id === currSchedule.id
      ? {
          boxShadow: `0 0 0 2px ${currSchedule?.textColor}`,
          borderColor: "transparent",
        }
      : schedule.pinned
        ? {
            boxShadow: `0 0 0 2px ${schedule?.textColor}`,
            borderColor: "transparent",
          }
        : {};

  // Build display rows (ONLY required events)
  const rows = useMemo(
    () =>
      schedule.events
        .filter((e) => e.isRequired === true)
        .slice()
        .sort((a, b) => {
          const ta = a.title.localeCompare(b.title);
          if (ta !== 0) return ta;
          const sa = (
            a.extendedProps?.section ??
            a.extendedProps?.lecture ??
            ""
          ).toString();
          const sb = (
            b.extendedProps?.section ??
            b.extendedProps?.lecture ??
            ""
          ).toString();
          return sa.localeCompare(sb);
        })
        .map((e) => ({
          key: e.id,
          title: e.title,
          instructor: e.extendedProps?.instructor ?? "",
          section: e.extendedProps?.section ?? e.extendedProps?.lecture ?? "",
        })),
    [schedule.events],
  );

  return (
    <Dropdown
      key={schedule.id}
      value={`sched${index + 1}`}
      title={`Schedule ${index + 1}`}
      icon={<Calendar size={12} color="#717680" />}
      actions={[
        {
          icon: (
            <span className="inline-flex h-3 w-3 items-center justify-center">
              <Pin
                // className="h-3 w-3" // if Pin supports className
                fill={schedule.pinned ? schedule.textColor : undefined}
                color={schedule.pinned ? schedule.textColor : undefined}
              />
            </span>
          ),
          onClick: () => {
            handlePinClick(schedule);
          },
        },
        { icon: <Upload size={12} color="#717680" /> },
      ]}
      defaultOpen={false}
      style={cardStyle}
      onClick={() => {
        handleScheduleClick(schedule);
      }}
    >
      {rows.length === 0 ? (
        <div className="py-2.5 text-[11px] text-gray-500">Nothing here yet</div>
      ) : (
        <div className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.key} className="py-1.5">
              {/* row 1: title (flex-1, truncates) + instructor (caps at 55% of width) */}
              <div className="flex min-w-0 items-center gap-1.5">
                <p className="min-w-0 flex-1 truncate text-xs font-medium leading-[1.15] text-text-darker">
                  {r.title}
                </p>
                {r.instructor ? (
                  <p className="min-w-0 max-w-[55%] truncate text-right text-[11px] leading-[1.15] text-[#535862]">
                    {r.instructor}
                  </p>
                ) : (
                  <span />
                )}
              </div>
              {/* row 2: section code */}
              <div className="mt-0.5 text-[11px] leading-[1.15] text-[#535862]">
                {r.section}
              </div>
            </div>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
