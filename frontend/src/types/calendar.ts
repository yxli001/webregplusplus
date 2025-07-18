export type CalSchedule = {
  id: number;
  pinned: boolean;
  events: CalEvent[];
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};
export type CalEvent = {
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
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};
