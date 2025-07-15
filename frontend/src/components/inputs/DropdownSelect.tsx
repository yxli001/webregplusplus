"use client";

import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import Check from "@/components/icons/Check";
import DownArrow from "@/components/icons/DownArrow";

type DropdownSelectProps = {
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  closeOnSelect?: boolean;
  disabled?: boolean;
  loading?: boolean;
  value: string;
  onChange: (value: string) => void;
};

const DropdownSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select",
  className = "",
  disabled = false,
  closeOnSelect = false, // Default to true
  loading = false,
}: DropdownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getLabel = () => {
    if (loading) {
      return "Loading...";
    }

    const selectedOption = options.find((opt) => opt.value === value);

    if (selectedOption) {
      return selectedOption.label;
    }

    return placeholder;
  };

  const toggleDropdown = () => {
    if (disabled) return;

    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);

    // Close the dropdown if closeOnSelect is true
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropDownContent = loading ? (
    <div className="flex h-full w-full items-center justify-center p-5">
      <ProgressSpinner
        className="h-10 w-10"
        strokeWidth="5"
        animationDuration="2s"
      />
    </div>
  ) : options.length > 0 ? (
    options.map((option) => (
      <div
        key={option.value}
        className="flex cursor-pointer items-center justify-between gap-2 px-4 py-[10px] hover:bg-[#fafafa]"
        style={{
          backgroundColor: value === option.value ? "#fafafa" : "",
        }}
        onClick={() => {
          handleOptionClick(option.value);
        }}
      >
        <span className="truncate text-sm text-text-dark">{option.label}</span>
        {value === option.value && <Check size={20} color="#1570ef" />}
      </div>
    ))
  ) : (
    <div className="px-4 py-[10px] text-sm italic text-text-light">
      No options available
    </div>
  );

  return (
    <div ref={dropdownRef} className={twMerge("relative w-full", className)}>
      <div
        className={`flex items-center justify-between gap-2 rounded-md border border-border bg-white px-4 py-[10px] ${!disabled ? "hover:cursor-pointer hover:bg-gray-50" : ""}`}
        onClick={toggleDropdown}
      >
        <span className="truncate text-sm font-semibold text-text-dark">
          {getLabel()}
        </span>
        <DownArrow size={20} color="#414651" />
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-1 max-h-60 w-52 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {dropDownContent}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
