import { Toast } from "primereact/toast";
import { useRef } from "react";

import ScheduleCard from "./ScheduleCard";

import { useScheduleStore } from "@/hooks/useScheduleStore";
import { CalSchedule } from "@/types/calendar";

type ScheduleListProps = {
  updateScheduleColors: (schedulesToUpdate: CalSchedule[]) => CalSchedule[];
};

const ScheduleList = ({ updateScheduleColors }: ScheduleListProps) => {
  const toast = useRef<Toast>(null);

  const schedules = useScheduleStore((state) => state.schedules);

  const showToast = (detail: string) =>
    toast.current?.show({
      severity: "info",
      summary: "Info",
      detail,
      life: 2000,
    });

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
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            index={index}
            updateScheduleColors={updateScheduleColors}
            showToast={showToast}
          />
        ))}
      </div>

      <Toast ref={toast} position="top-right" />
    </>
  );
};

export default ScheduleList;
