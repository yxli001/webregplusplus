import { twMerge } from "tailwind-merge";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type DropdownHeaderProps = {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  open?: boolean; // flips the chevron
  toggleProps?: ButtonHTMLAttributes<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

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
    <button
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

      <span className="flex items-center gap-2">
        {actions}
        <button
          type="button"
          aria-label={open ? "Collapse" : "Expand"}
          {...toggleProps}
          className={twMerge(
            "p-1 transition-transform duration-200 focus:outline-none",
            toggleProps?.className,
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className={twMerge("h-4 w-4", open ? "rotate-180" : "")}
          >
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" />
          </svg>
        </button>
      </span>
    </button>
  );
}
