import { useState } from "react";

import TimeSlotModal from "./TimeSlotModal";

type TimeSlot = {
  id: string;
  days: string;
  startTime: string;
  endTime: string;
};

type TimeSlotEditorProps = {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
  className?: string;
};

const TimeSlotEditor = ({
  value,
  onChange,
  className = "",
}: TimeSlotEditorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  const handleDelete = (id: string) => {
    onChange(value.filter((slot) => slot.id !== id));
  };

  const handleAdd = () => {
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setIsModalOpen(true);
  };

  const handleSave = (days: string, startTime: string, endTime: string) => {
    if (editingSlot) {
      // Edit existing slot
      onChange(
        value.map((slot) =>
          slot.id === editingSlot.id
            ? { ...slot, days, startTime, endTime }
            : slot,
        ),
      );
    } else {
      // Add new slot
      const newSlot: TimeSlot = {
        id: Math.random().toString(36).substring(7),
        days,
        startTime,
        endTime,
      };
      onChange([...value, newSlot]);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Time Slots */}
      <div className="flex flex-col gap-2">
        {value.map((slot) => (
          <div
            key={slot.id}
            className="flex items-center justify-between rounded-lg border border-border px-2 py-1"
          >
            <div className="text-md flex items-center gap-4">
              <span>{slot.days}</span>
              <span>
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
            <div className="flex items-center gap-4 text-primary-dark">
              <button
                className="hover:underline"
                onClick={() => {
                  handleEdit(slot);
                }}
              >
                Edit
              </button>
              <button
                className="hover:underline"
                onClick={() => {
                  handleDelete(slot.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        className="flex items-center gap-2 text-primary-dark hover:underline"
      >
        + Add days/times
      </button>

      {/* Edit Modal */}
      <TimeSlotModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default TimeSlotEditor;
