export interface CourseJSON {
  id: string;
  subject: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  subject: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}
