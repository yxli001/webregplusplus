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

export type Course = {
  subject: string;
  code: string;
  name: string;
  mainSections: MainSection[];
};

export type MainSection = {
  type: MainSectionType;
  letter: string;
  days: string;
  startTime: string;
  endTime: string;
  instructor: string;
  sections: SubSection[];
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
