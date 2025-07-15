import { ChevronUp } from "lucide-react";
import { twMerge } from "tailwind-merge";

import IconButton from "../inputs/IconButton";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type DropdownIcon = {
  icon: ReactNode;
  onClick?: () => void;
};
export type DropdownHeaderProps = {
  title: string;
  icon: ReactNode;
  actions: DropdownIcon[];
  open?: boolean; // flips the chevron
  toggleProps?: ButtonHTMLAttributes<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLDivElement>;

export default function DropdownHeader({
  title,
  icon,
  actions,
  open,
  toggleProps,
  className,
  ...buttonProps
}: DropdownHeaderProps) {
  return (
    <div
      {...buttonProps}
      className={twMerge(
        "flex w-full items-center justify-between gap-2 p-3",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {title}
      </span>

      <span className="flex items-center gap-3">
        {actions.map((action, idx) => (
          <IconButton key={idx} icon={action.icon} onClick={action.onClick} />
        ))}
        <button
          type="button"
          aria-label={open ? "Collapse" : "Expand"}
          {...toggleProps}
          className={twMerge(
            "p-1 transition-transform duration-200 focus:outline-none",
            toggleProps?.className,
          )}
        >
          <ChevronUp
            size={16}
            className={twMerge("h-4 w-4", open ? "rotate-180" : "")}
          />
        </button>
      </span>
    </div>
  );
}
