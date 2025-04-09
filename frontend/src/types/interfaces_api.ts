export interface CourseResponse {
  id: string;
  subject: string;
  code: string;
  mainSections: MainSectionResponse[];
}

export interface MainSectionResponse {
  id: string;
  type: string;
  courseId: string;
  letter: string;
  instructor: string;
  days: string;
  startTime: string;
  endTime: string;
  location: string;
  subSections: SubSectionResponse[];
  exams: ExamResponse[];
}

export interface SubSectionResponse {
  id: string;
  type: string;
  section: string;
  mainSectionId: string;
  days: string;
  location: string;
  startTime: string;
  endTime: string;
  isRequired: boolean;
}

export interface ExamResponse {
  id: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  mainSectionId: string;
}

export interface Course {
  id: string;
  subject: string;
  code: string;
}

export interface MainSection {
  id: string;
  type: string;
  course_id: string;
  letter: string;
  instructor: string;
  days: string;
  start_time: string;
  end_time: string;
  exam: Exam[];
  location: string;
}

export interface SubSection {
  id: string;
  type: string;
  section: string;
  main_section_id: string;
  days: string;
  location: string;
  start_time: string;
  end_time: string;
  is_required: boolean;
}

export interface Exam {
  id: string;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  main_section_id: string;
}

export interface Preferences {
  preferredStart: string; // e.g. "09:00"
  preferredEnd: string; // e.g. "15:00"
  preferredDays: number[]; // { "M": 6, "Tu": 9, "W": 6, "Th": 9, "F": 6 }
  spread: number;
  avoidBackToBack: boolean;
  //blockInstructor: string;
}

export interface Schedule {
  classes: (MainSection | SubSection)[];
  fitness: number;
}
