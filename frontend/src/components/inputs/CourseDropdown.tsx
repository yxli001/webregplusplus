"use client";

import { Toast } from "primereact/toast";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { twMerge } from "tailwind-merge";

import { getCourseDetails, getCourses } from "@/api/courses";
import Check from "@/components/icons/Check";
import Cross from "@/components/icons/Cross";
import Search from "@/components/icons/Search";
import { usePreferenceStore } from "@/hooks/usePreferenceStore";
import { Course } from "@/types/course";

type CourseOption = {
  label: string;
  value: Course;
};

type CourseDropdownProps = {
  maxCourses?: number;
  className?: string;
  disabled?: boolean;
};

/**
 * Dropdown to select courses
 *
 * @param props.fetchCourses - Function to fetch courses asynchronously based on a query
 * @param props.maxCourses - Maximum number of courses to select
 * @param props.loading - Whether the dropdown is currently loading options
 * @param props.className - Additional CSS classes for styling
 *
 * @returns CourseDropdown component
 */
const CourseDropdown = ({
  maxCourses = 10,
  className = "",
  disabled = false,
}: CourseDropdownProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const errorToast = useRef<Toast>(null);

  const [defaultOptions, setDefaultOptions] = useState([] as CourseOption[]);

  const selectedQuarter = usePreferenceStore((state) => state.selectedQuarter);
  const selectedCourses = usePreferenceStore((state) => state.selectedCourses);
  const setSelectedCourses = usePreferenceStore(
    (state) => state.setSelectedCourses,
  );
  const setCourseDetails = usePreferenceStore(
    (state) => state.setCourseDetails,
  );

  const selectedOptions = useMemo(
    () =>
      selectedCourses.map((course) => ({
        label: `${course.subject} ${course.code}`,
        value: course,
      })),
    [selectedCourses],
  );

  const fetchCourses = async (q: string) => {
    if (!selectedQuarter) {
      return [];
    }

    setLoading(true);

    const res = await getCourses(selectedQuarter, q);

    setLoading(false);

    if (!res.success) {
      errorToast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch courses",
        life: 2000,
      });

      return [];
    }

    return res.data;
  };

  const fetchCourseDetails = async () => {
    const res = await getCourseDetails(
      selectedQuarter,
      selectedCourses.map((c) => `${c.subject} ${c.code}`),
    );

    if (!res.success) {
      return errorToast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch course details",
        life: 2000,
      });
    }

    setCourseDetails(res.data);
  };

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
    // Only render select on mount to avoid hydration errors
    // This is an internal issue with react-select as far as I know
    // Refer to https://github.com/JedWatson/react-select/issues/5459 for more details
    setIsMounted(true);

    void initializeOptions();
  }, []);

  // Update course details when selectedCourses change
  // TODO: do atomized updates rather than refetching all selectedCourses
  // Should probably happens in the onChange handler of the Select component
  // Performance isn't a big concern since it's only one API call either way
  useEffect(() => {
    if (!selectedQuarter || selectedCourses.length === 0) {
      return;
    }

    void fetchCourseDetails();
  }, [selectedCourses]);

  // Needs to be defined inside the component to access selectedCourses
  const Option = ({
    ...props
  }: OptionProps<{ label: string; value: Course }, true>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
    const newProps = { ...props, innerProps: rest };

    const {
      isFocused,
      data: { label, value: course },
    } = props;

    // Get selected courses from store to check if this option is selected
    const isSelected = selectedCourses.some(
      (selectedCourse) => selectedCourse.id === course.id,
    );

    return (
      <components.Option {...newProps}>
        <div
          className={twMerge(
            "flex flex-row items-center justify-between p-4 hover:cursor-pointer hover:bg-foreground",
            isFocused ? "bg-foreground" : "",
          )}
        >
          <p>{label}</p>
          {isSelected && <Check size={20} color="#1570ef" />}
        </div>
      </components.Option>
    );
  };

  return (
    isMounted && (
      <>
        <AsyncSelect
          name="course"
          value={selectedOptions}
          loadOptions={loadOptions}
          defaultOptions={defaultOptions}
          isLoading={loading}
          isDisabled={disabled}
          getOptionValue={(option) => option.value.id}
          getOptionLabel={(option) => option.label}
          classNames={{
            container: () =>
              twMerge("w-full flex flex-col overflow-visible", className),
            control: () => "flex focus:outline-2",
            input: () => "sm:py-1",
            valueContainer: () => "flex flex-row items-center gap-2",
            multiValue: () =>
              "bg-background text-text-light border border-text-light rounded-3xl px-2",
            noOptionsMessage: () => "p-4 text-text-light",
            loadingMessage: () => "p-4 text-text-light",
            placeholder: () => "text-nowrap text-text-light",
          }}
          onChange={(cArr) => {
            // If no courses are selected, clear the selection
            if (!cArr) {
              setSelectedCourses([]);
              return;
            }

            // Limit to maxCourses
            // TODO: Add feedback if user tries to select more than maxCourses
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
          placeholder={"Search"}
          closeMenuOnSelect={true}
          hideSelectedOptions={false}
          blurInputOnSelect={false}
          tabSelectsValue={false}
          openMenuOnFocus={false}
          openMenuOnClick={false}
          controlShouldRenderValue={false}
          // No cache because cache retains through quarter changes
          // cacheOptions
          isClearable={false}
          isSearchable
          isMulti
          unstyled
        />
      </>
    )
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
      <div className="z-50 mt-2 rounded-lg border border-border bg-background shadow-lg">
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
      className="z-50 mt-2 rounded-lg border border-border bg-background shadow-lg"
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
      <div className="flex w-full flex-row items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-text-darker hover:cursor-pointer">
        <Search size={20} />
        {children}
      </div>
    </components.Control>
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
