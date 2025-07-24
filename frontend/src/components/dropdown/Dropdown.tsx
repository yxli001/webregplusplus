"use client";
import { useState } from "react";
import { useCollapse } from "react-collapsed";
import { twMerge } from "tailwind-merge";

import DropdownHeader, { DropdownIcon } from "./DropdownHeader";

import type { ReactNode } from "react";

export type DropdownProps = {
  value: string; // unique key if used in a list
  title: string;
  icon: ReactNode;
  actions: DropdownIcon[];
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void; // optional click handler for the header
};

export default function Dropdown({
  //value, // kept for parity—remove if unused
  title,
  icon,
  actions,
  defaultOpen = false,
  children,
  className,
  style,
  onClick,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const collapse = useCollapse({ isExpanded: isOpen });

  return (
    <div
      className={twMerge(
        "rounded-lg border border-border bg-white font-inter font-semibold text-[#181D27]",
        className,
      )}
      style={style}
    >
      <DropdownHeader
        title={title}
        icon={icon}
        actions={actions}
        open={isOpen}
        /* ONLY the chevron gets these props */
        toggleProps={collapse.getToggleProps({
          onClick: () => {
            setIsOpen(!isOpen);
          },
        })}
        onClick={onClick}
      />

      <div {...collapse.getCollapseProps()} className="border-t px-3 py-2">
        {children}
      </div>
    </div>
  );
}
