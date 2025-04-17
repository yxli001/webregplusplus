export interface CourseJSON {
  id: string;
  subject: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseWithSectionsJSON extends CourseJSON {
  mainSections: MainSectionJSON[];
}

export interface MainSectionJSON {
  id: string;
  type: string;
  letter: string;
  days: string;
  startTime: string;
  endTime: string;
  instructor: string;
  subSections: SubSectionJSON[];
  location: string;
  exams: ExamJSON[];
  createdAt: string;
  updatedAt: string;
  courseId: string;
}

export interface SubSectionJSON {
  id: string;
  type: string;
  section: string;
  days: string;
  startTime: string;
  endTime: string;
  isRequired: boolean;
  location: string;
  createdAt: string;
  updatedAt: string;
  mainSectionId: string;
}

export interface ExamJSON {
  id: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  mainSectionId: string;
}

export interface Course {
  id: string;
  subject: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseWithSections extends Course {
  mainSections: MainSection[];
}

export type MainSection = {
  id: string;
  type: MainSectionType;
  letter: string;
  days: string;
  startTime: string;
  endTime: string;
  instructor: string;
  subSections: SubSection[];
  location: string;
  exams: Exam[];
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
};

export type SubSection = {
  id: string;
  type: SubSectionType;
  section: string;
  days: string;
  startTime: string;
  endTime: string;
  isRequired: boolean;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  mainSectionId: string;
};

export type Exam = {
  id: string;
  type: ExamType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  mainSectionId: string;
};

export enum MainSectionType {
  LE = "LE",
  SE = "SE",
  LA = "LA",
  ST = "ST",
}

export enum SubSectionType {
  DI = "DI",
  LA = "LA",
}

export enum ExamType {
  MI = "MI",
  FI = "FI",
}
