"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClearIndicatorProps,
  ControlProps,
  GroupBase,
  MenuListProps,
  OptionProps,
  components,
} from "react-select";
import AsyncSelect from "react-select/async";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
} from "react-virtualized";

import { usePreferenceStore } from "@/hooks/usePreferenceStore";
import Check from "@/icons/Check";
import Cross from "@/icons/Cross";
import Search from "@/icons/Search";
import { Course } from "@/types/course";

type CourseOption = {
  label: string;
  value: Course;
};

type CourseDropdownProps = {
  fetchCourses: (query: string) => Promise<Course[]>;
  maxCourses?: number;
  className?: string;
  loading?: boolean;
};

/**
 * Dropdown to select courses
 *
 * @param props.fetchCourses - Function to asynchronously fetch courses based on a query
 * @param props.maxCourses - Maximum number of courses to select
 * @param props.loading - Whether the dropdown is in a loading state
 * @param props.className - Additional CSS classes to apply to the dropdown
 *
 * @returns CourseDropdown component
 */
const CourseDropdown = ({
  fetchCourses,
  maxCourses = 10,
  className = "",
  loading = false,
}: CourseDropdownProps) => {
  const [defaultOptions, setDefaultOptions] = useState([] as CourseOption[]);

  const selectedCourses = usePreferenceStore((state) => state.selectedCourses);
  const setSelectedCourses = usePreferenceStore(
    (state) => state.setSelectedCourses,
  );

  const selectedOptions = useMemo(
    () =>
      selectedCourses.map((course) => ({
        label: `${course.subject} ${course.code}`,
        value: course,
      })),
    [selectedCourses],
  );

  const initializeOptions = useCallback(async () => {
    const courses = await fetchCourses("");

    const options = courses.map((course) => ({
      label: `${course.subject} ${course.code}`,
      value: course,
    }));

    setDefaultOptions(options);
  }, [fetchCourses]);

  const loadOptions = useCallback(
    async (inputValue: string) => {
      const fetchedCourses = await fetchCourses(inputValue.trim());

      return fetchedCourses.map((course) => ({
        label: `${course.subject} ${course.code}`,
        value: course,
      }));
    },
    [fetchCourses],
  );

  useEffect(() => {
    void initializeOptions();
  }, []);

  return (
    <AsyncSelect
      name="course"
      value={selectedOptions}
      loadOptions={loadOptions}
      defaultOptions={defaultOptions}
      isLoading={loading}
      classNames={{
        container: () => `w-full flex flex-col overflow-visible ${className}`,
        control: () => "flex",
        input: () => "sm:py-1",
        valueContainer: () => "flex flex-row items-center gap-2",
        multiValue: () =>
          "bg-background text-text-light border border-text-light rounded-3xl px-2",
        noOptionsMessage: () => "p-4 text-text-light",
        loadingMessage: () => "p-4 text-text-light",
        placeholder: () => "text-nowrap text-elipsis",
      }}
      onChange={(cArr) => {
        // If no courses are selected, clear the selection
        if (!cArr) {
          setSelectedCourses([]);
          return;
        }

        // Limit to maxCourses
        if (cArr.length > maxCourses) return;

        setSelectedCourses(cArr.map((course) => course.value));
      }}
      components={{
        Option,
        Control,
        ClearIndicator,
        DropdownIndicator: () => null,
        MenuList: VirtualizedList,
      }}
      placeholder={"eg. BILD, BILD 3, or CSE 101"}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      blurInputOnSelect={false}
      tabSelectsValue={false}
      openMenuOnFocus={false}
      openMenuOnClick={false}
      cacheOptions
      isSearchable
      isClearable
      isMulti
      unstyled
    />
  );
};

const VirtualizedList = ({
  children,
}: MenuListProps<CourseOption, true, GroupBase<CourseOption>>) => {
  const rows = children;

  const cellCache: CellMeasurerCache = useMemo(() => {
    return new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 30,
    });
  }, []);

  if (!Array.isArray(rows)) {
    // For children like: "Loading" or "No Options" provided by 'react-select'
    return (
      <div className="z-50 mt-2 rounded-lg bg-foreground shadow-lg">
        {children}
      </div>
    );
  }

  const rowRenderer = ({ key, parent, index, style }: ListRowProps) => (
    <CellMeasurer
      cache={cellCache}
      key={key}
      columnIndex={0}
      rowIndex={index}
      parent={parent}
    >
      <div key={key} style={style}>
        {rows[index]}
      </div>
    </CellMeasurer>
  );

  return (
    <div
      style={{ height: "300px" }}
      className="z-50 mt-2 rounded-lg bg-foreground shadow-lg"
    >
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            deferredMeasurementCache={cellCache}
            rowHeight={cellCache.rowHeight}
            rowCount={rows.length}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
};

// Custom control component
const Control = ({
  children,
  ...props
}: ControlProps<{ label: string; value: Course }, true>) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Call the original onMouseDown if it exists
    props.innerProps.onMouseDown?.(e);

    // Find and focus the input element
    setTimeout(() => {
      const inputElement = document.querySelector(".react-select__input input");
      if (inputElement instanceof HTMLInputElement) {
        inputElement.focus();
      }
    }, 10);
  };

  return (
    <components.Control
      {...props}
      innerProps={{ ...props.innerProps, onMouseDown: handleMouseDown }}
      selectProps={{
        ...props.selectProps,
        onChange: (c, action) => {
          props.selectProps.onChange?.(c, action);
        },
      }}
    >
      <div className="flex w-full flex-row items-center justify-between gap-4 rounded-lg border border-text-light bg-foreground px-3 py-2 hover:cursor-pointer">
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

export default CourseDropdown;
