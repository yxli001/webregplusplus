import { Calendar, Upload } from "lucide-react";

import Dropdown from "./dropdown/Dropdown";
import Pin from "./icons/Pin";

import { useScheduleStore } from "@/hooks/useScheduleStore";

const ScheduleList = () => {
  const schedules = useScheduleStore((state) => state.schedules);
  const currSchedule = useScheduleStore((state) => state.currSchedule);
  const setCurrSchedule = useScheduleStore((state) => state.setCurrSchedule);

  /* Event Handlers */
  const handleScheduleClick = (scheduleId: number) => {
    const selectedSchedule = schedules.find((sched) => sched.id === scheduleId);

    if (selectedSchedule) {
      setCurrSchedule(selectedSchedule);
    }
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
              { icon: <Pin size={16} color="#717680" /> },
              { icon: <Upload size={16} color="#717680" /> },
            ]}
            defaultOpen={false}
            style={
              currSchedule && schedule.id === currSchedule.id
                ? {
                    boxShadow: `0 0 0 2px ${currSchedule?.textColor}`,
                    borderColor: "transparent",
                  }
                : {}
            }
            onClick={() => {
              handleScheduleClick(schedule.id);
            }}
          >
            <div>Nothing here yet</div>
          </Dropdown>
        ))}
      </div>
    </>
  );
};

export default ScheduleList;
