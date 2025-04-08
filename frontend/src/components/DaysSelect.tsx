interface DaysSelectProps {
  value: string[];
  onChange: (days: string[]) => void;
  className?: string;
}

const DAYS = ["M", "Tu", "W", "Th", "F"];

const DaysSelect = ({ value, onChange, className = "" }: DaysSelectProps) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {DAYS.map((day) => (
        <button
          key={day}
          onClick={() => {
            onChange(
              value.includes(day)
                ? value.filter((d) => d !== day)
                : [...value, day],
            );
          }}
          className={`px-3 py-1 rounded ${
            value.includes(day)
              ? "bg-primary-light text-white"
              : "bg-gray-100 text-text-dark"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default DaysSelect;
