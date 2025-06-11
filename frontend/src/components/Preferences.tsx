import { useState } from "react";

import Checkbox from "./Checkbox";
import DaysSelect from "./DaysSelect";
import DropdownSelect from "./DropdownSelect";
import TimeRangeSlider from "./TimeRangeSlider";
import TimeSlotEditor from "./TimeSlotEditor";

import { usePreferenceStore } from "@/hooks/usePreferenceStore";
import { SpreadPreference } from "@/types/preferences";

const spreadOptions = [
  { label: "Really Spread Out", value: "really-spread-out" },
  { label: "Slightly Spread Out", value: "slightly-spread-out" },
  { label: "Neutral", value: "neutral" },
  { label: "Compact", value: "compact" },
  { label: "Extremely Compact", value: "extremely-compact" },
];

const Preferences = () => {
  const [showExcludedTimes, setShowExcludedTimes] = useState(false);
  const [showSpacing, setShowSpacing] = useState(false);
  const [showPreferredDays, setShowPreferredDays] = useState(false);
  const [showPreferredTimeRange, setShowPreferredTimeRange] = useState(false);

  // Global state from preference store
  const schedulePreferences = usePreferenceStore(
    (state) => state.schedulePreferences,
  );
  const updateSchedulPreferences = usePreferenceStore(
    (state) => state.updateSchedulePreferences,
  );

  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-20">
      <div className="flex flex-col gap-6 md:w-[40%]">
        {/* Spread Preference */}
        <div className="flex flex-col gap-2">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => {
              setShowSpacing(!showSpacing);
            }}
          >
            <Checkbox
              checked={showSpacing}
              onChange={() => {
                setShowSpacing(!showSpacing);
              }}
            />
            <span className="text-text-light">Schedule Spacing</span>
          </div>
          {showSpacing && (
            <div className="pl-6">
              <DropdownSelect
                options={spreadOptions}
                value={schedulePreferences.spread}
                onChange={(value) => {
                  updateSchedulPreferences({
                    spread: value as SpreadPreference,
                  });
                }}
                placeholder="Select spacing preference"
                closeOnSelect
              />
            </div>
          )}
        </div>

        {/* Preferred Days */}
        <div className="flex flex-col gap-2">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => {
              const newState = !showPreferredDays;
              setShowPreferredDays(newState);
              if (!newState) {
                updateSchedulPreferences({ preferredDays: [] });
              }
            }}
          >
            <Checkbox
              checked={showPreferredDays}
              onChange={() => {
                const newState = !showPreferredDays;
                setShowPreferredDays(newState);
                if (!newState) {
                  updateSchedulPreferences({ preferredDays: [] });
                }
              }}
            />
            <span className="text-text-light">Preferred Days</span>
          </div>
          {showPreferredDays && (
            <div className="pl-6">
              <DaysSelect
                value={schedulePreferences.preferredDays}
                onChange={(days) => {
                  updateSchedulPreferences({ preferredDays: days });
                }}
              />
            </div>
          )}
        </div>

        {/* Preferred Time Range */}
        <div className="flex flex-col gap-2">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => {
              setShowPreferredTimeRange(!showPreferredTimeRange);
            }}
          >
            <Checkbox checked={showPreferredTimeRange} />
            <span className="text-text-light">Preferred Time Range</span>
          </div>

          {showPreferredTimeRange && (
            <div className="pl-6">
              <TimeRangeSlider
                startTime={schedulePreferences.preferredStart}
                endTime={schedulePreferences.preferredEnd}
                onChange={(startTime, endTime) => {
                  updateSchedulPreferences({
                    preferredStart: startTime,
                    preferredEnd: endTime,
                  });
                }}
                className="max-w-72"
              />
            </div>
          )}
        </div>

        {/* Avoid Back-to-Back Option */}
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => {
            updateSchedulPreferences({
              avoidBackToBack: !schedulePreferences.avoidBackToBack,
            });
          }}
        >
          <Checkbox
            checked={schedulePreferences.avoidBackToBack}
            onChange={() => {
              updateSchedulPreferences({
                avoidBackToBack: !schedulePreferences.avoidBackToBack,
              });
            }}
          />
          <span>Avoid back-to-back classes</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {/* Excluded Time Slots Option */}
        <div className="flex flex-col gap-2">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => {
              setShowExcludedTimes(!showExcludedTimes);
            }}
          >
            <Checkbox
              checked={showExcludedTimes}
              onChange={() => {
                setShowExcludedTimes(!showExcludedTimes);
              }}
            />
            <span>Exclude sections that meet on</span>
          </div>
          {showExcludedTimes && (
            <div className="pl-6">
              <TimeSlotEditor
                value={schedulePreferences.excludedTimeSlots}
                onChange={(slots) => {
                  updateSchedulPreferences({ excludedTimeSlots: slots });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preferences;
