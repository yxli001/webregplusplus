"use client";

import { ReactNode, createContext, useRef } from "react";

import { createScheduleStore } from "@/store/scheduleStore";

export type ScheduleStoreApi = ReturnType<typeof createScheduleStore>;

export const ScheduleStoreContext = createContext<ScheduleStoreApi | undefined>(
  undefined,
);

export type ScheduleStoreProviderProps = {
  children: ReactNode;
};

export const ScheduleStoreProvider = ({
  children,
}: ScheduleStoreProviderProps) => {
  const storeRef = useRef<ScheduleStoreApi | null>(null);

  // Ensures that store is created once per client
  storeRef.current ??= createScheduleStore();

  return (
    <ScheduleStoreContext.Provider value={storeRef.current}>
      {children}
    </ScheduleStoreContext.Provider>
  );
};
