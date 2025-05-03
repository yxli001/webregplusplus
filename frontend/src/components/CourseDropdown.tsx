"use client";

import React, { useEffect, useState } from "react";
import Select, {
  ClearIndicatorProps,
  components,
  ControlProps,
  createFilter,
  OptionProps,
} from "react-select";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

import { Course } from "@/types/course";

import Check from "@/icons/Check";
import Search from "@/icons/Search";
import Cross from "@/icons/Cross";
import { usePreferenceStore } from "@/store/preferenceStore";

// EmotionCacheProvider to ensure Emotion styles are inserted before Tailwind styles
const EmotionCacheProvider = ({ children }: { children: React.ReactNode }) => {
  const [cache, setCache] = useState<ReturnType<typeof createCache> | null>(
    null,
  );

  useEffect(() => {
    // Create the Emotion cache with the insertion point
    const emotionCache = createCache({
      key: "with-tailwind",
      insertionPoint: document.querySelector(
        'meta[name="emotion-insertion-point"]',
      ) as HTMLElement,
    });
    setCache(emotionCache);
  }, []);

  // Render children only after the cache is created
  if (!cache) return null;

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

// Custom control component
const Control = ({
  children,
  ...props
}: ControlProps<{ label: string; value: Course }, true>) => {
  return (
    <components.Control {...props}>
      <div className="w-full bg-foreground flex flex-row items-center justify-between gap-4 px-3 py-2 border border-text-light rounded-lg hover:cursor-pointer">
        <Search size={18} />
        {children}
      </div>
    </components.Control>
  );
};

// Custom Option component
const Option = ({
  ...props
}: OptionProps<{ label: string; value: Course }, true>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
  const newProps = { ...props, innerProps: rest };

  const {
    isFocused,
    isSelected,
    data: { label },
  } = props;

  return (
    <components.Option {...newProps}>
      <div
        className={`flex flex-row items-center justify-between p-4 hover:cursor-pointer hover:bg-gray-100 ${isFocused ? "bg-gray-100" : ""}`}
      >
        <p>{label}</p>
        {isSelected && <Check />}
      </div>
    </components.Option>
  );
};

const ClearIndicator = ({
  ...props
}: ClearIndicatorProps<{ label: string; value: Course }>) => {
  return (
    <components.ClearIndicator {...props}>
      <div className="hover:cursor-pointer">
        <Cross />
      </div>
    </components.ClearIndicator>
  );
};

interface CourseDropdownProps {
  courses: Course[];
  maxCourses?: number;
  className?: string;
}

/**
 * Dropdown to select courses
 *
 * @param props.courses - List of courses to display in the dropdown
 * @param props.maxCourses - Maximum number of courses to select
 *
 * @returns CourseDropdown component
 */
const CourseDropdown = ({
  courses,
  maxCourses = 10,
  className = "",
}: CourseDropdownProps) => {
  const selectedCourses = usePreferenceStore((state) => state.selectedCourses);
  const setSelectedCourses = usePreferenceStore(
    (state) => state.setSelectedCourses,
  );

  return (
    <EmotionCacheProvider>
      <Select
        classNames={{
          container: () => `w-full flex flex-col overflow-visible ${className}`,
          menuList: () => "mt-2 bg-foreground shadow-lg rounded-lg z-50",
          input: () => "py-1",
          valueContainer: () => "flex flex-row items-center gap-2",
          multiValue: () =>
            "bg-background text-text-light border border-text-light rounded-3xl px-2",
          noOptionsMessage: () => "p-4 text-text-light",
        }}
        name="course"
        value={selectedCourses.map((course) => ({
          label: `${course.subject} ${course.code}`,
          value: course,
        }))}
        onChange={(e) => {
          if (!e) {
            setSelectedCourses([]);
            return;
          }

          // Limit to maxCourses
          if (e.length > maxCourses) return;

          setSelectedCourses(e.map((course) => course.value));
        }}
        options={courses.map((course) => ({
          label: `${course.subject} ${course.code}`,
          value: course,
        }))}
        filterOption={createFilter({
          ignoreAccents: false,
          trim: true,
          ignoreCase: true,
          matchFrom: "any",
        })}
        components={{
          Option: Option,
          Control: Control,
          ClearIndicator: ClearIndicator,
          DropdownIndicator: () => null,
        }}
        placeholder="eg. BILD, BILD 3, or CSE 101"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        blurInputOnSelect={false}
        tabSelectsValue={false}
        isSearchable
        isClearable
        isMulti
        unstyled
      />
    </EmotionCacheProvider>
  );
};

export default CourseDropdown;
