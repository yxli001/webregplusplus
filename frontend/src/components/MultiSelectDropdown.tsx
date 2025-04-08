"use client";

import { useState, useEffect, useRef } from "react";
import UpDownArrows from "@/icons/UpDownArrows";
import Checkbox from "@/components/Checkbox";

interface DropdownProps {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelectDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && options.length > 0) {
      onChange(options.map((option) => option.value));
      setInitialized(true);
    }
  }, [options, onChange, initialized]);

  const getLabel = () => {
    if (value.length === options.length) {
      return "All Selected";
    } else if (value.length > 0) {
      return "Custom";
    } else {
      return placeholder;
    }
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const isSelected = (optionValue: string) => value.includes(optionValue);

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
        className="flex items-center justify-between bg-white border border-text-light rounded-md p-2 sm:p-3 cursor-pointer hover:bg-gray-50"
        onClick={toggleDropdown}
      >
        <span className="truncate text-sm sm:text-base">{getLabel()}</span>
        <UpDownArrows size={16} className="sm:w-5 sm:h-5" />
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-1 w-full max-h-60 overflow-y-auto rounded-md bg-white border border-gray-200 shadow-lg">
          {options.length > 0 ? (
            options.map((option) => (
              <div
                key={option.value}
                className="p-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100"
                onClick={() => handleOptionClick(option.value)}
              >
                <Checkbox
                  checked={isSelected(option.value)}
                  onChange={() => handleOptionClick(option.value)}
                />
                <span className="truncate text-sm sm:text-base">
                  {option.label}
                </span>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 italic text-sm sm:text-base">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
