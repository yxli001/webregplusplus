export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  daysOfWeek?: number[];
  extendedProps?: {
    lecture?: string;
    section?: string;
    meetingType?: string;
    instructor?: string;
    location?: string;
  };
}
