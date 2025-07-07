import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  left: ReactNode; // filters / search / course cards
  center: ReactNode; // calendar or other main canvas
  right: ReactNode; // alternate schedules list
  className?: string;
};

export default function ThreePane({
  left,
  center,
  right,
  className = "",
}: Props) {
  return (
    <div
      className={twMerge(
        "/* subtract navbar height */ flex h-[calc(100vh-4rem)]",
        className,
      )}
    >
      {/* ───── Left column ───── */}
      <aside className="border-muted w-72 shrink-0 overflow-y-auto border-r">
        {left}
      </aside>

      {/* ───── Middle canvas ───── */}
      <main className="flex-1 overflow-y-auto">{center}</main>

      {/* ───── Right column ───── */}
      <aside className="border-muted w-64 shrink-0 overflow-y-auto border-l">
        {right}
      </aside>
    </div>
  );
}
