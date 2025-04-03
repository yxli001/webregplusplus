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

  // Compute the custom label for the dropdown
  const getLabel = () => {
    if (value.length === options.length) {
      return "All Selected"; // Show "All Selected" when all items are selected
    } else if (value.length > 0) {
      return "Custom"; // Show "Custom" when some items are selected
    } else {
      return placeholder; // Show placeholder when no items are selected
    }
  };

  // Toggle the dropdown open/close state
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle selecting/deselecting an option
  const handleOptionClick = (optionValue: string) => {
    if (value.includes(optionValue)) {
      // Remove the option if it's already selected
      onChange(value.filter((v) => v !== optionValue));
    } else {
      // Add the option if it's not selected
      onChange([...value, optionValue]);
    }
  };

  // Check if an option is selected
  const isSelected = (optionValue: string) => value.includes(optionValue);

  // Close the dropdown when clicking outside
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
      {/* Label */}
      <div
        className="flex items-center justify-between bg-foreground border border-text-light rounded-md p-3 cursor-pointer"
        onClick={toggleDropdown}
      >
        {getLabel()}
        <UpDownArrows size={20} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full max-h-40 overflow-y-auto border border-text-light rounded-md bg-foreground shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer flex items-center gap-2`}
              onClick={() => handleOptionClick(option.value)}
            >
              <Checkbox
                checked={isSelected(option.value)}
                onChange={() => handleOptionClick(option.value)}
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
