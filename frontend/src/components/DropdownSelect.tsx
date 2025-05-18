"use client";

import { useState, useEffect, useRef } from "react";
import UpDownArrows from "@/icons/UpDownArrows";
import Checkbox from "@/components/Checkbox";
import Radio from "@/components/Radio";

interface BaseDropdownProps {
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  closeOnSelect?: boolean; // Add the new prop here
  disabled?: boolean;
}

interface SingleSelectDropdownProps extends BaseDropdownProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

interface MultiSelectDropdownProps extends BaseDropdownProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  minSelected?: number;
}

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

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div
        className={`flex items-center justify-between rounded-md border border-text-light bg-white p-2 sm:p-3 ${!disabled ? "hover:cursor-pointer hover:bg-gray-50" : ""}`}
        onClick={toggleDropdown}
      >
        <span className="truncate text-sm sm:text-base">{getLabel()}</span>
        <UpDownArrows size={16} className="sm:h-5 sm:w-5" />
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {options.length > 0 ? (
            options.map((option) => (
              <div
                key={option.value}
                className="flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-100"
                onClick={() => handleOptionClick(option.value)}
              >
                {multiple ? (
                  <Checkbox
                    checked={values.includes(option.value)}
                    onChange={() => {}}
                  />
                ) : (
                  <Radio
                    checked={value === option.value}
                    onChange={() => {}}
                    name="dropdown-option"
                  />
                )}
                <span className="flex-1 truncate text-sm sm:text-base">
                  {option.label}
                </span>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm italic text-gray-500 sm:text-base">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
