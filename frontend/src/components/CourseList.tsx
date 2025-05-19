import { memo, useCallback, useEffect, useMemo } from "react";

import Checkbox from "./Checkbox";

import SelectDropdown from "@/components/DropdownSelect";
import {
  useCoursePreference,
  usePreferenceStore,
} from "@/store/preferenceStore";
import { CourseWithSections } from "@/types/course";

const CourseCard = memo(({ course }: { course: CourseWithSections }) => {
  const pref = useCoursePreference(course.id)!;
  const updateCoursePreferences = usePreferenceStore(
    (state) => state.updateCoursePreferences,
  );

  // Initialize preferences when component mounts - only once
  useEffect(() => {
    // Check if we need to initialize
    const needsInitialization =
      !pref.selectedInstructors.length || !pref.selectedSubSections.length;

    if (needsInitialization) {
      // Get unique instructors
      const uniqueInstructors = Array.from(
        new Set(course.mainSections.map((section) => section.instructor)),
      );

      // Get all subsections from sections with the first instructor
      const firstInstructor = uniqueInstructors[0];
      const initialSubSections = course.mainSections
        .filter((section) => section.instructor === firstInstructor)
        .flatMap((section) =>
          section.subSections
            .filter((subSection) => !subSection.isRequired)
            .map((subSection) => `${section.letter}${subSection.section}`),
        );

      // Only update if we have valid data
      if (uniqueInstructors.length > 0) {
        updateCoursePreferences(course.id, {
          selectedInstructors: [firstInstructor],
          selectedSubSections: initialSubSections,
        });
      }
    }
  }, [course.id]); // Only run once when the component mounts

  const toggleIncluded = useCallback(() => {
    updateCoursePreferences(course.id, { included: !pref.included });
  }, [course.id, pref.included, updateCoursePreferences]);

  const handleInstructorChange = useCallback(
    (selected: string[]) => {
      // Skip if no change
      if (
        JSON.stringify(selected) === JSON.stringify(pref.selectedInstructors)
      ) {
        return;
      }

      // Get all subsections from sections with the selected instructors
      const newSubSections = course.mainSections
        .filter((section) => selected.includes(section.instructor))
        .flatMap((section) =>
          section.subSections
            .filter((subSection) => !subSection.isRequired)
            .map((subSection) => `${section.letter}${subSection.section}`),
        );

      // Get subsections from previously selected instructors
      const previouslyAvailableSubSections = course.mainSections
        .filter((section) =>
          pref.selectedInstructors.includes(section.instructor),
        )
        .flatMap((section) =>
          section.subSections
            .filter((subSection) => !subSection.isRequired)
            .map((subSection) => `${section.letter}${subSection.section}`),
        );

      // Find subsections that are no longer available
      const removedSubSections = previouslyAvailableSubSections.filter(
        (subSection) => !newSubSections.includes(subSection),
      );

      // Find subsections that are newly available
      const addedSubSections = newSubSections.filter(
        (subSection) => !previouslyAvailableSubSections.includes(subSection),
      );

      // Preserve existing subsection selections that are still valid
      // and add newly available subsections
      const updatedSubSections = [
        ...pref.selectedSubSections.filter(
          (subSection) => !removedSubSections.includes(subSection),
        ),
        ...addedSubSections,
      ];

      // Update the preferences
      updateCoursePreferences(course.id, {
        selectedInstructors: selected,
        selectedSubSections: updatedSubSections,
      });
    },
    [
      course.id,
      course.mainSections,
      pref.selectedInstructors,
      pref.selectedSubSections,
      updateCoursePreferences,
    ],
  );

  const handleSubSectionChange = useCallback(
    (selected: string[]) => {
      // Only update if there are changes
      if (
        JSON.stringify(selected) !== JSON.stringify(pref.selectedSubSections)
      ) {
        updateCoursePreferences(course.id, {
          selectedSubSections: selected,
        });
      }
    },
    [course.id, pref.selectedSubSections, updateCoursePreferences],
  );

  const instructorOptions = useMemo(() => {
    const uniqueInstructors = Array.from(
      new Set(course.mainSections.map((section) => section.instructor)),
    );
    return uniqueInstructors.map((instructor) => ({
      label: instructor,
      value: instructor,
    }));
  }, [course.mainSections]);

  const subSectionOptions = useMemo(() => {
    // If there are no selected instructors, return an empty array
    if (!pref.selectedInstructors.length) {
      return [];
    }

    // Get all subsections from sections with selected instructors
    const allSubSections = course.mainSections
      .filter((section) =>
        pref.selectedInstructors.includes(section.instructor),
      )
      .flatMap((section) => {
        // If no subsections, return an empty array
        if (!section.subSections.length) {
          return [];
        }

        return (
          section.subSections
            // Filter out required subsections
            .filter((subSection) => !subSection.isRequired)
            .map((subSection) => ({
              label: `${section.letter}${subSection.section} | ${subSection.type} | ${subSection.days} | ${subSection.startTime}-${subSection.endTime}`,
              value: `${section.letter}${subSection.section}`,
            }))
        );
      });

    // Sort alphabetically by section value (e.g., "A01", "A02", "B01", etc.)
    return allSubSections.sort((a, b) => a.value.localeCompare(b.value));
  }, [course.mainSections, pref.selectedInstructors]);

  return (
    <div
      className={`flex w-full flex-col gap-4 rounded-md border border-text-light px-4 py-4 sm:px-6 ${!pref.included ? "opacity-50" : ""}`}
    >
      <div
        className="flex items-center gap-4 hover:cursor-pointer"
        onClick={toggleIncluded}
      >
        <Checkbox
          checked={pref.included}
          variant="light"
          className="h-5 w-5 p-1"
          onChange={toggleIncluded}
        />
        <h1 className="text-xl font-medium uppercase text-text-dark sm:text-2xl">
          {course.subject} {course.code}
        </h1>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-md text-text-light">Instructor</p>
        <SelectDropdown
          options={instructorOptions}
          value={pref.selectedInstructors}
          onChange={handleInstructorChange}
          placeholder="Select Instructor"
          disabled={!pref.included}
          multiple
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-md text-text-light">Sections</p>
        <SelectDropdown
          options={subSectionOptions}
          value={pref.selectedSubSections}
          onChange={handleSubSectionChange}
          placeholder="Select Sections"
          disabled={!pref.included}
          multiple
        />
      </div>
    </div>
  );
});

CourseCard.displayName = "CourseCard";

const CourseList = memo(() => {
  const courseDetails = usePreferenceStore((state) => state.courseDetails);

  return (
    <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {courseDetails.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
});

CourseList.displayName = "CourseList";

export default CourseList;
