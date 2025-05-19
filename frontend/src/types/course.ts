export type QuarterJSON = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseJSON = {
  id: string;
  subject: string;
  code: string;
  quarterId: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseWithSectionsJSON = {
  mainSections: MainSectionJSON[];
} & CourseJSON;

export type MainSectionJSON = {
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
};

export type SubSectionJSON = {
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
};

export type ExamJSON = {
  id: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  mainSectionId: string;
};

export type Quarter = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Course = {
  id: string;
  subject: string;
  code: string;
  quarterId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseWithSections = {
  mainSections: MainSection[];
} & Course;

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
