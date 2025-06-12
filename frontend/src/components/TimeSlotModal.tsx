import { useMemo, useState } from "react";

import DaysSelect from "./DaysSelect";
import Modal from "./Modal";

type TimeSlotModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (days: string, startTime: string, endTime: string) => void;
};

const TimeSlotModal = ({ isOpen, onClose, onSave }: TimeSlotModalProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Convert time string to minutes since midnight for comparison
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isValidTimeRange = useMemo(() => {
    if (!startTime || !endTime) return false;

    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    // Check if times are within the day (0:00 to 23:59)
    if (start < 0 || start >= 24 * 60 || end < 0 || end >= 24 * 60) {
      return false;
    }

    // Check if end time is after start time
    return end > start;
  }, [startTime, endTime]);

  const handleSave = () => {
    if (
      selectedDays.length === 0 ||
      !startTime ||
      !endTime ||
      !isValidTimeRange
    ) {
      return;
    }
    onSave(selectedDays.join(""), startTime, endTime);

    setSelectedDays([]);
    setStartTime("");
    setEndTime("");

    onClose();
  };

  const handleClose = () => {
    // Reset form
    setSelectedDays([]);
    setStartTime("");
    setEndTime("");
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      className="flex max-w-md flex-col gap-2 rounded-lg p-6"
    >
      <h2 className="mb-4 font-semibold text-text-dark text-xl">
        Edit Time Slot
      </h2>

      {/* Days Selection */}
      <div className="mb-4">
        <label className="mb-2 block font-medium text-sm text-text-dark">
          Days
        </label>
        <DaysSelect value={selectedDays} onChange={setSelectedDays} />
      </div>

      {/* Time Selection */}
      <div className="mb-2 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block font-medium text-sm text-text-dark">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
            }}
            className="w-full rounded-md border border-text-light px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block font-medium text-sm text-text-dark">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
            className="w-full rounded-md border border-text-light px-3 py-2"
          />
        </div>
      </div>

      {/* Time Validation Message */}
      {startTime && endTime && !isValidTimeRange && (
        <p className="mb-4 text-red-500 text-sm">
          End time must be after start time
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-text-dark hover:text-text-darker"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={
            selectedDays.length === 0 ||
            !startTime ||
            !endTime ||
            !isValidTimeRange
          }
          className="rounded-md bg-primary-light px-4 py-2 text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default TimeSlotModal;
