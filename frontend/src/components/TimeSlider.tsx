import { useMemo } from "react";

type TimeSliderProps = {
  value: number;
  onChange: (minutes: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

const TimeSlider = ({
  value,
  onChange,
  min = 0,
  max = 720, // 12 hours in minutes
  className = "",
}: TimeSliderProps) => {
  // Convert minutes to "X hr, Ymin" format
  const formattedTime = useMemo(() => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (hours === 0) {
      return `${minutes}min`;
    }

    if (minutes === 0) {
      return `${hours}hr`;
    }

    return `${hours}hr, ${minutes}min`;
  }, [value]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="relative h-1 w-full rounded-full bg-gray-200">
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={value}
          onChange={(e) => {
            onChange(parseInt(e.target.value));
          }}
          className="absolute z-30 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="absolute h-full rounded-full bg-primary-light"
          style={{
            width: `${((value - min) / (max - min)) * 100}%`,
          }}
        />
        <div
          className="absolute h-4 w-4 -translate-y-1.5 rounded-full bg-primary-light"
          style={{
            left: `calc(${((value - min) / (max - min)) * 100}% - 0.5rem)`,
          }}
        />
      </div>
      <div className="flex justify-end">
        <span className="text-md">{formattedTime}</span>
      </div>
    </div>
  );
};

export default TimeSlider;
