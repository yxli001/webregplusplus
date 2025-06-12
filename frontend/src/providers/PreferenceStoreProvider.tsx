"use client";

import { type ReactNode, createContext, useRef } from "react";

import { createPreferenceStore } from "@/store/preferenceStore";

export type PreferenceStoreApi = ReturnType<typeof createPreferenceStore>;

export const PreferenceStoreContext = createContext<
  PreferenceStoreApi | undefined
>(undefined);

export type PreferenceStoreProviderProps = {
  children: ReactNode;
};

export const PreferenceStoreProvider = ({
  children,
}: PreferenceStoreProviderProps) => {
  const storeRef = useRef<PreferenceStoreApi | null>(null);

  // Ensures that store is created once per client
  storeRef.current ??= createPreferenceStore();

  return (
    <PreferenceStoreContext.Provider value={storeRef.current}>
      {children}
    </PreferenceStoreContext.Provider>
  );
};
