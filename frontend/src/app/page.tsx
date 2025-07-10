import { BookOpen, Calendar, Eye, Trash2, Upload } from "lucide-react";

import ScheduleDisplay from "@/components/ScheduleDisplay";
import ThreePane from "@/components/ThreePane";
import Dropdown from "@/components/dropdown/Dropdown";
import Pin from "@/icons/Pin";
import { CalEvent } from "@/types/calendar";
export default function Home() {
  const sampleEvents: CalEvent[] = [
    {
      id: "cse101-lec",
      title: "CSE 101  • Algorithms (Lecture)",
      startTime: "11:00",
      endTime: "12:20",
      daysOfWeek: [2, 4], // Tue, Thu
      extendedProps: {
        lecture: "A00",
        meetingType: "Lecture",
        instructor: "Prof. Li",
        location: "Center Hall 119",
      },
    },
    {
      id: "cse101-disc",
      title: "CSE 101  • Discussion",
      startTime: "14:00",
      endTime: "14:50",
      daysOfWeek: [5], // Fri
      extendedProps: {
        section: "D01",
        meetingType: "Discussion",
        instructor: "TA Singh",
        location: "PCYNH 122",
      },
    },
    {
      id: "math20b-lec",
      title: "MATH 20B  • Integral Calculus (Lecture)",
      startTime: "10:00",
      endTime: "10:50",
      daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
      extendedProps: {
        lecture: "B00",
        meetingType: "Lecture",
        instructor: "Dr. Alvarez",
        location: "Warren Lecture Hall 2005",
      },
    },
    {
      id: "math20b-disc",
      title: "MATH 20B  • Discussion",
      startTime: "16:00",
      endTime: "16:50",
      daysOfWeek: [2], // Tue
      extendedProps: {
        section: "D02",
        meetingType: "Discussion",
        instructor: "TA García",
        location: "AP&M 2402",
      },
    },
    {
      id: "phys2a-lec",
      title: "PHYS 2A  • Mechanics (Lecture)",
      startTime: "13:00",
      endTime: "13:50",
      daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
      extendedProps: {
        lecture: "C00",
        meetingType: "Lecture",
        instructor: "Prof. Bennett",
        location: "York Hall 2622",
      },
    },
    {
      id: "phys2a-lab",
      title: "PHYS 2A  • Lab",
      startTime: "14:00",
      endTime: "16:50",
      daysOfWeek: [4], // Thu
      extendedProps: {
        section: "L04",
        meetingType: "Lab",
        instructor: "Lab Staff",
        location: "Revelle Phys Lab B10",
      },
    },
  ];
  return (
    <ThreePane
      left={
        <aside className="flex flex-col gap-6 p-6">
          <Dropdown
            value="cogs108a"
            title="COGS 108A"
            icon={<BookOpen size={16} />}
            actions={[<Trash2 size={16} />, <Eye size={16} />]}
            defaultOpen
          >
            <div>test</div>
          </Dropdown>
          <Dropdown
            value="cogs1"
            title="Cogs 1"
            icon={<BookOpen size={16} />}
            actions={[<Trash2 size={16} />, <Eye size={16} />]}
            defaultOpen
          >
            <div>test</div>
          </Dropdown>
          <Dropdown
            value="cogs1"
            title="Cogs 1"
            icon={<BookOpen size={16} />}
            actions={[<Trash2 size={16} />, <Eye size={16} />]}
            defaultOpen
          >
            <div>test</div>
          </Dropdown>
        </aside>
      }
      center={
        <main className="flex">
          <ScheduleDisplay events={sampleEvents} />
        </main>
      }
      right={
        <aside className="flex flex-col gap-6 p-6">
          <Dropdown
            value="cogs1"
            title="Cogs 1"
            icon={<Calendar size={16} />}
            actions={[<Pin size={20} />, <Eye size={16} />]}
            defaultOpen
          >
            <div>test</div>
          </Dropdown>
          <Dropdown
            value="cogs1"
            title="Cogs 1"
            icon={<Calendar size={16} />}
            actions={[<Pin size={20} />, <Upload size={16} />]}
            defaultOpen
          >
            <div>test</div>
          </Dropdown>
          <Dropdown
            value="cogs1"
            title="Cogs 1"
            icon={<Calendar size={16} />}
            actions={[<Pin size={20} />, <Upload size={16} />]}
            defaultOpen
          >
            <div>test</div>
          </Dropdown>
        </aside>
      }
    />
  );
}
