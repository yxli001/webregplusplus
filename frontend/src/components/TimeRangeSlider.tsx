import { Slider, SliderChangeEvent } from "primereact/slider";

type TimeRangeSliderProps = {
  startTime: string; // 24-hour format HH:mm
  endTime: string; // 24-hour format HH:mm
  onChange: (startTime: string, endTime: string) => void;
  className?: string;
  min?: string; // 24-hour format HH:mm
  max?: string; // 24-hour format HH:mm
};

const TimeRangeSlider = ({
  startTime,
  endTime,
  onChange,
  className = "",
  min = "08:00",
  max = "22:00",
}: TimeRangeSliderProps) => {
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const formatTimeDisplay = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const minMinutes = timeToMinutes(min);
  const maxMinutes = timeToMinutes(max);

  const handleChange = (value: number[]) => {
    const [newStart, newEnd] = value;

    // If handles would cross, maintain minimum 30-minute gap
    if (newEnd - newStart < 30) {
      // If dragging start handle
      if (newStart !== startMinutes) {
        onChange(minutesToTime(newEnd - 30), minutesToTime(newEnd));
      }
      // If dragging end handle
      else if (newEnd !== endMinutes) {
        onChange(minutesToTime(newStart), minutesToTime(newStart + 30));
      }
      return;
    }

    onChange(minutesToTime(newStart), minutesToTime(newEnd));
  };

  return (
    <div className={`flex flex-col py-4 ${className}`}>
      <div className="mb-4 flex justify-between text-sm text-text-light">
        <span>{formatTimeDisplay(startTime)}</span>
        <span>{formatTimeDisplay(endTime)}</span>
      </div>
      <div className="w-full">
        <Slider
          unstyled
          value={[startMinutes, endMinutes]}
          onChange={(e: SliderChangeEvent) => {
            handleChange(e.value as number[]);
          }}
          min={minMinutes}
          max={maxMinutes}
          range
          step={30}
          pt={{
            root: {
              className: "relative h-1 bg-border rounded-full border-none",
            },
            range: {
              className: "absolute h-full bg-primary-light rounded-full",
            },
            handle: {
              className:
                "absolute w-4 h-4 bg-primary-light rounded-full shadow cursor-grab hover:bg-primary-dark active:cursor-grabbing -mt-1.5 -ml-2",
            },
          }}
        />
      </div>
    </div>
  );
};

export default TimeRangeSlider;
