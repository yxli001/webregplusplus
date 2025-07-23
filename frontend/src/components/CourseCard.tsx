import { BookOpen, ChevronUp, Eye, EyeOffIcon, Trash2 } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

import Dropdown from "./dropdown/Dropdown";
import Checkbox from "./inputs/Checkbox";

import {
  useCoursePreference,
  usePreferenceStore,
} from "@/hooks/usePreferenceStore";
import { CourseWithSections, SubSection } from "@/types/course";

const CourseCard = ({ course }: { course: CourseWithSections }) => {
  const pref = useCoursePreference(course.id)!;
  const updateCoursePreferences = usePreferenceStore(
    (state) => state.updateCoursePreferences,
  );
  const removeCourse = usePreferenceStore((state) => state.removeCourse);

  // State to track which instructor sections are open
  const [openInstructors, setOpenInstructors] = useState<Set<string>>(() => {
    // Get all unique instructors and default them to be open
    const allInstructors = new Set<string>();
    course.mainSections.forEach((section) => {
      allInstructors.add(section.instructor);
    });
    return allInstructors;
  });

  /* Helper Functions */

  // Get an array of [instructor, subSections]
  const getAllSectionsByInstructor = useCallback(() => {
    const sectionsByInstructor: Record<
      string,
      Record<string, SubSection[]>
    > = {};

    course.mainSections.forEach((section) => {
      if (!sectionsByInstructor[section.instructor]) {
        sectionsByInstructor[section.instructor] = {};
      }

      if (!sectionsByInstructor[section.instructor][section.letter]) {
        sectionsByInstructor[section.instructor][section.letter] = [];
      }

      section.subSections.forEach((subSection) => {
        sectionsByInstructor[section.instructor][section.letter].push(
          subSection,
        );
      });
    });

    return Object.entries(sectionsByInstructor).map(
      ([instructor, sections]) => ({
        instructor,
        sections,
      }),
    );
  }, [course.mainSections]);

  /* Event Handlers */

  const handleToggleInstructorExpanded = useCallback((instructor: string) => {
    setOpenInstructors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(instructor)) {
        newSet.delete(instructor);
      } else {
        newSet.add(instructor);
      }
      return newSet;
    });
  }, []);

  const handleToggleIncluded = useCallback(() => {
    updateCoursePreferences(course.id, { included: !pref.included });
  }, [course.id, pref.included, updateCoursePreferences]);

  const handleDeleteCourse = useCallback(() => {
    removeCourse(course.id);
  }, [course.id, removeCourse]);

  const handleSubSectionToggle = useCallback(
    (mainSectionLetter: string, subSection: SubSection) => {
      if (subSection.isRequired) return; // Skip if it's a required section

      const sectionId = `${mainSectionLetter}${subSection.section}`;
      const isCurrentlySelected = pref.selectedSubSections.includes(sectionId);

      let newSelectedSubSections: string[];

      if (isCurrentlySelected) {
        // Deselecting this subsection
        newSelectedSubSections = pref.selectedSubSections.filter(
          (s) => s !== sectionId,
        );
      } else {
        // Selecting this subsection
        newSelectedSubSections = [...pref.selectedSubSections, sectionId];
      }

      // Check if all non-required subsections for this main section letter are now deselected
      const allSubSectionsForLetter: string[] = [];
      const requiredSubSectionsForLetter: string[] = [];

      course.mainSections.forEach((section) => {
        if (section.letter === mainSectionLetter) {
          section.subSections.forEach((sub) => {
            const subId = `${section.letter}${sub.section}`;
            allSubSectionsForLetter.push(subId);
            if (sub.isRequired) {
              requiredSubSectionsForLetter.push(subId);
            }
          });
        }
      });

      const nonRequiredSubSectionsForLetter = allSubSectionsForLetter.filter(
        (id) => !requiredSubSectionsForLetter.includes(id),
      );

      const selectedNonRequiredForLetter = newSelectedSubSections.filter((id) =>
        nonRequiredSubSectionsForLetter.includes(id),
      );

      // If no non-required subsections are selected for this letter, also deselect required ones
      if (selectedNonRequiredForLetter.length === 0) {
        newSelectedSubSections = newSelectedSubSections.filter(
          (id) => !requiredSubSectionsForLetter.includes(id),
        );
      }

      updateCoursePreferences(course.id, {
        selectedSubSections: newSelectedSubSections,
      });
    },
    [
      pref.selectedSubSections,
      course.id,
      updateCoursePreferences,
      course.mainSections,
    ],
  );

  const getInstructorCheckboxState = useCallback(
    (_instructor: string, sections: Record<string, SubSection[]>) => {
      const nonRequiredSubSections: string[] = [];
      Object.entries(sections).forEach(([letter, subSections]) => {
        subSections.forEach((subSection) => {
          if (!subSection.isRequired) {
            nonRequiredSubSections.push(`${letter}${subSection.section}`);
          }
        });
      });

      const selectedCount = nonRequiredSubSections.filter((section) =>
        pref.selectedSubSections.includes(section),
      ).length;

      if (selectedCount === 0) return false;
      if (selectedCount === nonRequiredSubSections.length) return true;
      return undefined; // Indeterminate state
    },
    [pref.selectedSubSections],
  );

  const getSubSectionCheckboxState = useCallback(
    (
      letter: string,
      subSection: SubSection,
      sections: Record<string, SubSection[]>,
    ) => {
      if (subSection.isRequired) {
        // For required sections, check if any non-required sections of the same letter are selected
        const nonRequiredForLetter =
          sections[letter]?.filter((sub) => !sub.isRequired) || [];
        return nonRequiredForLetter.some((sub) =>
          pref.selectedSubSections.includes(`${letter}${sub.section}`),
        );
      } else {
        // For non-required sections, check normally
        return pref.selectedSubSections.includes(
          `${letter}${subSection.section}`,
        );
      }
    },
    [pref.selectedSubSections],
  );

  const handleInstructorToggle = useCallback(
    (instructor: string, sections: Record<string, SubSection[]>) => {
      const allSubSections: string[] = [];
      const requiredSubSections: string[] = [];
      const nonRequiredSubSections: string[] = [];

      Object.entries(sections).forEach(([letter, subSections]) => {
        subSections.forEach((subSection) => {
          const sectionId = `${letter}${subSection.section}`;
          allSubSections.push(sectionId);
          if (subSection.isRequired) {
            requiredSubSections.push(sectionId);
          } else {
            nonRequiredSubSections.push(sectionId);
          }
        });
      });

      const currentState = getInstructorCheckboxState(instructor, sections);

      if (currentState === true || currentState === undefined) {
        // Unselect all (when fully checked or in intermediate state)
        updateCoursePreferences(course.id, {
          selectedSubSections: pref.selectedSubSections.filter(
            (section) => !allSubSections.includes(section),
          ),
        });
      } else {
        // Select all non-required sections (when unchecked)
        // Required sections will be handled automatically based on main section letter logic
        const newSelections = [
          ...pref.selectedSubSections.filter(
            (section) => !allSubSections.includes(section),
          ),
          ...nonRequiredSubSections,
        ];

        // For each main section letter, if we're selecting any non-required subsections,
        // also select the required ones for that letter
        const letterGroups: Record<
          string,
          { required: string[]; nonRequired: string[] }
        > = {};

        Object.entries(sections).forEach(([letter, subSections]) => {
          if (!letterGroups[letter]) {
            letterGroups[letter] = { required: [], nonRequired: [] };
          }

          subSections.forEach((subSection) => {
            const sectionId = `${letter}${subSection.section}`;
            if (subSection.isRequired) {
              letterGroups[letter].required.push(sectionId);
            } else {
              letterGroups[letter].nonRequired.push(sectionId);
            }
          });
        });

        // Add required sections for letters that have selected non-required sections
        Object.entries(letterGroups).forEach(([_letter, { required }]) => {
          newSelections.push(...required);
        });

        updateCoursePreferences(course.id, {
          selectedSubSections: [...new Set(newSelections)], // Remove duplicates
        });
      }
    },
    [
      pref.selectedSubSections,
      course.id,
      updateCoursePreferences,
      getInstructorCheckboxState,
    ],
  );

  return (
    <Dropdown
      key={course.id}
      value={course.id}
      title={`${course.subject} ${course.code}`}
      icon={<BookOpen size={16} />}
      actions={[
        {
          icon: <Trash2 size={16} color="#717680" />,
          onClick: handleDeleteCourse,
        },
        {
          icon: pref.included ? (
            <Eye size={16} color="#717680" />
          ) : (
            <EyeOffIcon size={16} />
          ),
          onClick: handleToggleIncluded,
        },
      ]}
      defaultOpen
    >
      <div className="flex flex-col gap-6">
        {getAllSectionsByInstructor().map(({ instructor, sections }) => (
          <div
            key={instructor}
            className="flex flex-col gap-3 overflow-x-hidden whitespace-nowrap text-nowrap"
          >
            <div className="flex justify-between gap-5">
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => {
                  handleInstructorToggle(instructor, sections);
                }}
              >
                <Checkbox
                  checked={getInstructorCheckboxState(instructor, sections)}
                />
                <p className="flex-shrink truncate text-sm font-medium text-text-darker">
                  {instructor}
                </p>
              </div>
              <span
                className="flex-shrink-0 p-1"
                onClick={() => {
                  handleToggleInstructorExpanded(instructor);
                }}
              >
                <ChevronUp
                  size={16}
                  color="#717680"
                  className={twMerge(
                    "h-4 w-4 cursor-pointer transition-transform",
                    openInstructors.has(instructor) ? "rotate-180" : "",
                  )}
                />
              </span>
            </div>
            {openInstructors.has(instructor) && (
              <div className="ml-3 mr-5 flex flex-col gap-3 overflow-hidden border-l border-border pl-3 text-xs">
                {Object.entries(sections).map(([letter, subSections]) => (
                  <Fragment key={letter}>
                    {subSections.map((subSection) => (
                      <div
                        key={`${letter}${subSection.section}`}
                        className="flex cursor-pointer items-center gap-3 font-normal text-gray-600"
                        onClick={() => {
                          handleSubSectionToggle(letter, subSection);
                        }}
                      >
                        <Checkbox
                          checked={getSubSectionCheckboxState(
                            letter,
                            subSection,
                            sections,
                          )}
                          disabled={subSection.isRequired}
                        />
                        <span>
                          {letter}
                          {subSection.section}
                        </span>
                        <span>{subSection.type}</span>
                        <span>{subSection.days}</span>
                        <span>
                          {subSection.startTime}-{subSection.endTime}
                        </span>
                        <span>{subSection.location}</span>
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Dropdown>
  );
};

export default CourseCard;
