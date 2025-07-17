import { createStore } from "zustand/vanilla";

import { CalSchedule } from "@/types/calendar";

export type ScheduleState = {
  schedules: CalSchedule[];
  currSchedule: CalSchedule | null;
};

export type ScheduleActions = {
  setSchedules: (schedules: CalSchedule[]) => void;
  setCurrSchedule: (schedule: CalSchedule | null) => void;
};

export type ScheduleStore = ScheduleState & ScheduleActions;

const initialSchedule: ScheduleState = {
  schedules: [],
  currSchedule: null,
};

export const createScheduleStore = (
  initState: ScheduleState = initialSchedule,
) => {
  return createStore<ScheduleStore>((set) => ({
    ...initState,
    setSchedules: (schedules) => {
      set({ schedules });
      set({ currSchedule: schedules.length > 0 ? schedules[0] : null });
    },
    setCurrSchedule: (currSchedule) => {
      set({ currSchedule });
    },
  }));
};
