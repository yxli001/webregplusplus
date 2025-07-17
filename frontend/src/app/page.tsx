"use client";
import { BookOpen, Calendar, Eye, Trash2, Upload } from "lucide-react";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

import { getCourses } from "@/api/courses";
import ScheduleDisplay from "@/components/ScheduleDisplay";
import Dropdown from "@/components/dropdown/Dropdown";
import Pin from "@/components/icons/Pin";
import ButtonGroup from "@/components/inputs/ButtonGroup";
import CourseDropdown from "@/components/inputs/CourseDropdown";
import ThreePane from "@/components/layouts/ThreePane";
import { usePreferenceStore } from "@/hooks/usePreferenceStore";
import { CalEvent } from "@/types/calendar";

export default function Home() {
  const sampleEvents: CalEvent[] = [
    {
      id: "cse101-lec",
      title: "CSE 101",
      startTime: "11:00",
      endTime: "12:20",
      daysOfWeek: [2, 4], // Tue, Thu
      extendedProps: {
        lecture: "A00",
        meetingType: "LE",
        instructor: "Prof. Li",
        location: "Center Hall 119",
      },
    },
    {
      id: "cse101-disc",
      title: "CSE 101",
      startTime: "14:00",
      endTime: "14:50",
      daysOfWeek: [5], // Fri
      extendedProps: {
        section: "D01",
        meetingType: "DI",
        instructor: "TA Singh",
        location: "PCYNH 122",
      },
    },
    {
      id: "math20b-lec",
      title: "MATH 20B",
      startTime: "10:00",
      endTime: "10:50",
      daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
      extendedProps: {
        lecture: "B00",
        meetingType: "LE",
        instructor: "Dr. Alvarez",
        location: "Warren Lecture Hall 2005",
      },
    },
    {
      id: "math20b-disc",
      title: "MATH 20B",
      startTime: "16:00",
      endTime: "16:50",
      daysOfWeek: [2], // Tue
      extendedProps: {
        section: "D02",
        meetingType: "DI",
        instructor: "TA García",
        location: "AP&M 2402",
      },
    },
    {
      id: "phys2a-lec",
      title: "PHYS 2A",
      startTime: "13:00",
      endTime: "13:50",
      daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
      extendedProps: {
        lecture: "C00",
        meetingType: "LE",
        instructor: "Prof. Bennett",
        location: "York Hall 2622",
      },
    },
    {
      id: "phys2a-lab",
      title: "PHYS 2A",
      startTime: "14:00",
      endTime: "16:50",
      daysOfWeek: [4], // Thu
      extendedProps: {
        section: "L04",
        meetingType: "LA",
        instructor: "Lab Staff",
        location: "Revelle Phys Lab B10",
      },
    },
  ];
  const selectedQuarter = usePreferenceStore((state) => state.selectedQuarter);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [activeTab, setActiveTab] = useState<"calendar" | "finals" | "list">(
    "calendar",
  );

  const errorToast = useRef<Toast>(null);

  // Helper functions
  const fetchCourses = async (q: string) => {
    if (!selectedQuarter) {
      return [];
    }

    setLoadingCourses(true);

    const res = await getCourses(selectedQuarter, q);

    setLoadingCourses(false);

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

  // Event handlers

  return (
    <>
      <ThreePane
        left={
          <aside className="flex flex-col gap-6 p-6">
            <CourseDropdown
              fetchCourses={fetchCourses}
              loading={loadingCourses}
              disabled={!selectedQuarter}
            />
            <Dropdown
              value="cogs1"
              title="COGS 108A"
              icon={<BookOpen size={16} />}
              actions={[
                { icon: <Trash2 size={16} /> },
                { icon: <Eye size={16} /> },
              ]}
              defaultOpen
            >
              <div>test</div>
            </Dropdown>
          </aside>
        }
        center={
          <main className="flex h-full w-full flex-col items-end p-6">
            <ButtonGroup
              className="flex"
              buttons={[
                {
                  label: "Calendar",
                  active: activeTab === "calendar",
                  onClick: () => {
                    setActiveTab("calendar");
                  },
                },
                {
                  label: "Finals",
                  active: activeTab === "finals",
                  onClick: () => {
                    setActiveTab("finals");
                  },
                },
                {
                  label: "List",
                  active: activeTab === "list",
                  onClick: () => {
                    setActiveTab("list");
                  },
                },
              ]}
            />
            {activeTab === "calendar" && (
              <ScheduleDisplay events={sampleEvents} />
            )}
            {activeTab === "finals" && (
              <ScheduleDisplay events={sampleEvents} />
            )}
            {activeTab === "list" && <ScheduleDisplay events={[]} />}
          </main>
        }
        right={
          <aside className="flex flex-col gap-6 p-6">
            <Dropdown
              value="sched1"
              title="Schedule 1"
              icon={<Calendar size={16} />}
              actions={[
                { icon: <Pin size={16} /> },
                { icon: <Upload size={16} /> },
              ]}
              defaultOpen
            >
              <div>test</div>
            </Dropdown>
          </aside>
        }
      />
      <Toast ref={errorToast} />
    </>
  );
}
