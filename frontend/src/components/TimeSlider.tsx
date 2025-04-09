import { useMemo } from "react";

interface TimeSliderProps {
  value: number;
  onChange: (minutes: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

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
      <div className="relative w-full h-1 bg-gray-200 rounded-full">
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-30"
        />
        <div
          className="absolute h-full bg-primary-light rounded-full"
          style={{
            width: `${((value - min) / (max - min)) * 100}%`,
          }}
        />
        <div
          className="absolute w-4 h-4 bg-primary-light rounded-full -translate-y-1.5"
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
