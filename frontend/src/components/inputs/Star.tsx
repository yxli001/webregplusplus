import { Star } from "lucide-react";

const YELLOW = "#EAAA08";

export default function PreferredDayStar({
  active,
  onClick,
  className,
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label="Toggle preferred day"
      className={`${className ?? ""} star-button ${active ? "opacity-100" : ""}`}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        marginRight: 2,
        cursor: "pointer",
      }}
    >
      <Star size={14} stroke={YELLOW} fill={active ? YELLOW : "none"} />
    </button>
  );
}
