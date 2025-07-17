import { useContext } from "react";
import { useStore } from "zustand";

import { ScheduleStoreContext } from "@/providers/ScheduleStoreProvider";
import { ScheduleStore } from "@/store/scheduleStore";

export const useScheduleStore = <T>(
  selector: (store: ScheduleStore) => T,
): T => {
  const scheduleStoreContext = useContext(ScheduleStoreContext);

  if (!scheduleStoreContext) {
    throw new Error(
      `useScheduleStore must be used within ScheduleStoreProvider`,
    );
  }

  return useStore(scheduleStoreContext, selector);
};
