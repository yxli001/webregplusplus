import { Calendar, Upload } from "lucide-react";
import { Toast } from "primereact/toast";
import { useRef } from "react";

import Dropdown from "./dropdown/Dropdown";
import Pin from "./icons/Pin";

import { useScheduleStore } from "@/hooks/useScheduleStore";
import { maxPinnedSchedules, scheduleColors } from "@/lib/constants";
import { CalSchedule } from "@/types/calendar";

type ScheduleListProps = {
  updateScheduleColors: (schedulesToUpdate: CalSchedule[]) => CalSchedule[];
};

const ScheduleList = ({ updateScheduleColors }: ScheduleListProps) => {
  const toast = useRef<Toast>(null);

  const schedules = useScheduleStore((state) => state.schedules);
  const setSchedules = useScheduleStore((state) => state.setSchedules);
  const currSchedule = useScheduleStore((state) => state.currSchedule);
  const setCurrSchedule = useScheduleStore((state) => state.setCurrSchedule);

  /* Event Handlers */
  const handleScheduleClick = (schedule: CalSchedule) => {
    if (schedule.pinned) {
      return;
    }

    const colorIndex = Math.min(
      schedules.filter((sched) => sched.pinned).length,
      scheduleColors.length - 1,
    );

    setCurrSchedule({
      ...schedule,
      backgroundColor: scheduleColors[colorIndex].backgroundColor,
      textColor: scheduleColors[colorIndex].textColor,
      borderColor: scheduleColors[colorIndex].backgroundColor,
    });
  };

  const handlePinClick = (schedule: CalSchedule) => {
    const newSchedules = schedules.map((sched) => {
      if (schedule.id === sched.id) {
        return {
          ...sched,
          pinned: !sched.pinned,
        };
      }
      return sched;
    });

    const pinned = newSchedules.filter((sched) => sched.pinned);

    if (pinned.length === maxPinnedSchedules) {
      toast.current?.show({
        severity: "info",
        summary: "Info",
        detail: `You can only pin up to ${maxPinnedSchedules} schedules. Please unpin one before pinning another.`,
        life: 2000,
      });

      return;
    }

    // Apply colors and update schedules
    const coloredSchedules = updateScheduleColors(newSchedules);

    setSchedules(coloredSchedules);
    setCurrSchedule(null);
  };

  return (
    <>
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-text-darker">Schedules</h2>
        <p className="text-sm text-gray-600">
          Add courses to generate schedules
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {schedules.map((schedule, index) => (
          <Dropdown
            key={schedule.id}
            value={`sched${index + 1}`}
            title={`Schedule ${index + 1}`}
            icon={<Calendar size={16} color="#717680" />}
            actions={[
              {
                icon: (
                  <Pin
                    fill={schedule.pinned ? schedule.textColor : undefined}
                    color={schedule.pinned ? schedule.textColor : undefined}
                  />
                ),
                onClick: () => {
                  handlePinClick(schedule);
                },
              },
              { icon: <Upload size={16} color="#717680" /> },
            ]}
            defaultOpen={false}
            style={
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
                  : {}
            }
            onClick={() => {
              handleScheduleClick(schedule);
            }}
          >
            <div>Nothing here yet</div>
          </Dropdown>
        ))}
      </div>
      <Toast ref={toast} position="top-right" />
    </>
  );
};

export default ScheduleList;
