"use client";

import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useRef, useState } from "react";

import Checkbox from "@/components/Checkbox";
import UpDownArrows from "@/icons/UpDownArrows";

type BaseDropdownProps = {
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  closeOnSelect?: boolean; // Add the new prop here
  disabled?: boolean;
  loading?: boolean;
};

type SingleSelectDropdownProps = {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
} & BaseDropdownProps;

type MultiSelectDropdownProps = {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  minSelected?: number;
} & BaseDropdownProps;

type DropdownSelectProps = SingleSelectDropdownProps | MultiSelectDropdownProps;

const DropdownSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  multiple = false,
  disabled = false,
  closeOnSelect = false, // Default to true
  loading = false,
  ...props
}: DropdownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  const values = Array.isArray(value) ? value : [value];

  useEffect(() => {
    if (!initialized && options.length > 0 && multiple) {
      onChange(options.map((option) => option.value) as string & string[]);
      setInitialized(true);
    }
  }, [options, onChange, initialized, multiple]);

  const getLabel = () => {
    if (multiple) {
      if (values.length === options.length) {
        return "All Selected";
      } else if (values.length > 0) {
        return "Custom";
      }
    } else {
      const selectedOption = options.find((opt) => opt.value === value);
      if (selectedOption) {
        return selectedOption.label;
      }
    }
    return placeholder;
  };

  const toggleDropdown = () => {
    if (disabled) return;

    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const minSelected = (props as MultiSelectDropdownProps).minSelected ?? 1;
      if (values.includes(optionValue)) {
        if (values.length <= minSelected) {
          return;
        }
        onChange(values.filter((v) => v !== optionValue) as string & string[]);
      } else {
        onChange([...values, optionValue] as string & string[]);
      }
    } else {
      onChange(optionValue as string & string[]);
    }

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
        className="flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-50"
        style={{
          backgroundColor:
            !multiple && values.includes(option.value) ? "#f0f0f0" : "",
        }}
        onClick={() => {
          handleOptionClick(option.value);
        }}
      >
        {multiple && <Checkbox checked={values.includes(option.value)} />}
        <span className="flex-1 truncate text-base">{option.label}</span>
      </div>
    ))
  ) : (
    <div className="p-2 text-base italic text-gray-500">
      No options available
    </div>
  );

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div
        className={`flex items-center justify-between rounded-md border border-text-light bg-white p-2 sm:p-3 ${!disabled ? "hover:cursor-pointer hover:bg-gray-50" : ""}`}
        onClick={toggleDropdown}
      >
        <span className="truncate text-base">{getLabel()}</span>
        <UpDownArrows size={16} className="sm:h-5 sm:w-5" />
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {dropDownContent}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
