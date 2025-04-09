import { MainSectionResponse } from "@/app/types/interfaces_api";

export interface CourseJSON {
  id: string;
  subject: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseWithSectionsJSON extends CourseJSON {
  mainSections: MainSectionResponse[];
}

export interface MainSectionJSON {
  type: string;
  letter: string;
  days: string;
  startTime: string;
  endTime: string;
  instructor: string;
  sections: SubSectionJSON[];
  location: string;
  exams: ExamJSON[];
}

export interface SubSectionJSON {
  type: string;
  section: string;
  days: string;
  startTime: string;
  endTime: string;
  isRequired: boolean;
  location: string;
}

export interface ExamJSON {
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
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
  type: MainSectionType;
  letter: string;
  days: string;
  startTime: string;
  endTime: string;
  instructor: string;
  subSections: SubSection[];
  location: string;
  exams: Exam[];
};

export type SubSection = {
  type: SubSectionType;
  section: string;
  days: string;
  startTime: string;
  endTime: string;
  isRequired: boolean;
  location: string;
};

export type Exam = {
  type: ExamType;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
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
