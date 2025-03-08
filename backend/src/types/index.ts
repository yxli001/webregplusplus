export enum MainSectionType {
  LE = "LE",
  SE = "SE",
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
};

export type SubSection = {
  type: SubSectionType;
  section: number;
  days: string;
  startTime: string;
  endTime: string;
  isRequired: boolean;
};
