import { useContext } from "react";
import { useStore } from "zustand";

import { PreferenceStoreContext } from "@/providers/PreferenceStoreProvider";
import { PreferenceStore } from "@/store/preferenceStore";

export const usePreferenceStore = <T>(
  selector: (store: PreferenceStore) => T,
): T => {
  const preferenceStoreContext = useContext(PreferenceStoreContext);

  if (!preferenceStoreContext) {
    throw new Error(
      `usePreferenceStore must be used within PreferenceStoreProvider`,
    );
  }

  return useStore(preferenceStoreContext, selector);
};

export const useCoursePreference = (courseId: string) =>
  usePreferenceStore((state) =>
    state.coursePreferences.find((pref) => pref.courseId === courseId),
  );
