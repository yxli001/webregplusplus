// type SectionType = "DI" | "LA";

//   export interface Course {
//   id: number;
//   subject: string;
//   code: number;
// }

export interface Lecture {
  id: number;
  lecture_letter: string;
  course_id: number;
  instructor: string;
  days: string[];
  start_time: string; // Storing as string since it's in HH:mm format
  end_time: string;
  location: string;
}

export interface Section {
  id: number;
  section_id: string;
  lecture_id: number;
  meeting_type: string; // "Discussion" or "Lab"
  days: string[];
  location: string;
  available_seats: number;
  start_time: string;
  end_time: string;
  is_required: boolean;
}

export interface Preferences {
  preferredStart: string; // e.g. "09:00"
  preferredEnd: string; // e.g. "15:00"
  preferredDays: number[]; // { "M": 6, "Tu": 9, "W": 6, "Th": 9, "F": 6 }
  spread: number;
  avoidBackToBack: boolean;
}

export interface Schedule {
  classes: (Lecture | Section)[];
  fitness: number;
  // backToBack: boolean;
  // spread: boolean;
  // preferredStart: boolean;
}
