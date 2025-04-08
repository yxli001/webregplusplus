import { CourseWithSections } from "@/types/course";
import Checkbox from "./Checkbox";
import { useFilterStore, useCoursePreference } from "@/store/filterStore";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { memo, useCallback, useEffect, useMemo } from "react";

const CourseCard = memo(({ course }: { course: CourseWithSections }) => {
  const pref = useCoursePreference(course.id)!;
  const updateCoursePreferences = useFilterStore(
    (state) => state.updateCoursePreferences,
  );

  // Initialize preferences when component mounts - only once
  useEffect(() => {
    // Check if we need to initialize
    const needsInitialization =
      !pref.selectedMainSections.length || !pref.selectedSubSections.length;

    if (needsInitialization) {
      // Create a stable reference to avoid unnecessary updates
      const initialMainSections = course.mainSections.map(
        (section) => section.letter,
      );

      // Get all non-required subsections from all main sections
      const initialSubSections = course.mainSections.flatMap((section) =>
        section.subSections
          .filter((subSection) => !subSection.isRequired)
          .map((subSection) => `${section.letter}${subSection.section}`),
      );

      // Only update if we have valid data
      if (initialMainSections.length > 0) {
        updateCoursePreferences(course.id, {
          selectedMainSections: initialMainSections,
          selectedSubSections: initialSubSections,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]); // Only run once when the component mounts

  const toggleIncluded = useCallback(() => {
    updateCoursePreferences(course.id, { included: !pref.included });
  }, [course.id, pref.included, updateCoursePreferences]);

  const handleMainSectionChange = useCallback(
    (selected: string[]) => {
      // Skip if no change
      if (
        JSON.stringify(selected) === JSON.stringify(pref.selectedMainSections)
      ) {
        return;
      }

      // Get the previous selection
      const previousSelection = pref.selectedMainSections;

      // Find which main sections were added (newly selected)
      const newlySelected = selected.filter(
        (section) => !previousSelection.includes(section),
      );

      // Find which main sections were removed (deselected)
      const deselected = previousSelection.filter(
        (section) => !selected.includes(section),
      );

      // Start with the current subsection selection
      let updatedSubSections = [...pref.selectedSubSections];

      // Remove subsections from deselected main sections
      if (deselected.length > 0) {
        updatedSubSections = updatedSubSections.filter((section) => {
          const mainSectionLetter = section.charAt(0);
          return !deselected.includes(mainSectionLetter);
        });
      }

      // Add all non-required subsections from newly selected main sections
      if (newlySelected.length > 0) {
        const newSubSections = course.mainSections
          .filter((section) => newlySelected.includes(section.letter))
          .flatMap((section) => {
            // Skip if the section has no subsections
            if (!section.subSections || !section.subSections.length) {
              return [];
            }

            return section.subSections
              .filter((subSection) => !subSection.isRequired)
              .map((subSection) => `${section.letter}${subSection.section}`);
          });

        // Only add new subsections if there are any
        if (newSubSections.length > 0) {
          updatedSubSections = [
            ...new Set([...updatedSubSections, ...newSubSections]),
          ];
        }
      }

      // Update the preferences
      updateCoursePreferences(course.id, {
        selectedMainSections: selected,
        selectedSubSections: updatedSubSections,
      });
    },
    [course.id, course.mainSections, pref, updateCoursePreferences],
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

  const mainSectionOptions = useMemo(
    () =>
      course.mainSections.map((section) => ({
        label: section.instructor,
        value: section.letter,
      })),
    [course.mainSections],
  );

  const subSectionOptions = useMemo(() => {
    // If there are no selected main sections, return an empty array
    if (!pref.selectedMainSections.length) {
      return [];
    }

    // Get all subsections from selected main sections
    const allSubSections = pref.selectedMainSections.flatMap((section) => {
      const mainSection = course.mainSections.find((s) => s.letter === section);

      // If no main section is found or it has no subsections, return an empty array
      if (!mainSection || !mainSection.subSections.length) {
        return [];
      }

      return (
        mainSection.subSections
          // Filter out required subsections
          .filter((subSection) => !subSection.isRequired)
          .map((subSection) => ({
            label: `${section}${subSection.section} | ${subSection.type} | ${subSection.days} | ${subSection.startTime}-${subSection.endTime}`,
            value: `${section}${subSection.section}`,
          }))
      );
    });

    // Sort alphabetically by section value (e.g., "A01", "A02", "B01", etc.)
    return allSubSections.sort((a, b) => a.value.localeCompare(b.value));
  }, [course.mainSections, pref.selectedMainSections]);

  return (
    <div className="w-full flex flex-col rounded-md border border-text-light px-4 sm:px-6 py-4 gap-4">
      <div
        className="flex gap-4 items-center hover:cursor-pointer"
        onClick={toggleIncluded}
      >
        <Checkbox
          checked={pref.included}
          variant="light"
          className="w-5 h-5 p-1"
          onChange={toggleIncluded}
        />
        <h1 className="text-xl sm:text-2xl font-medium text-text-dark uppercase">
          {course.subject} {course.code}
        </h1>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-md text-text-light">Instructor</p>
        <MultiSelectDropdown
          options={mainSectionOptions}
          value={pref.selectedMainSections}
          onChange={handleMainSectionChange}
          placeholder="Select Instructor"
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-md text-text-light">Sections</p>
        <MultiSelectDropdown
          options={subSectionOptions}
          value={pref.selectedSubSections}
          onChange={handleSubSectionChange}
          placeholder="Select Sections"
        />
      </div>
    </div>
  );
});

CourseCard.displayName = "CourseCard";

const CourseList = memo(() => {
  const courseDetails = useFilterStore((state) => state.courseDetails);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {courseDetails.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
});

CourseList.displayName = "CourseList";

export default CourseList;
