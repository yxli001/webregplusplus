"use client";

import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import { useState } from "react";

export default function Home() {
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);

  return (
    <div>
      <MultiSelectDropdown
        options={[
          { label: "Cao, Yingjun", value: "A" },
          { label: "Ochoa, Ben", value: "B" },
        ]}
        value={selectedInstructors}
        onChange={setSelectedInstructors}
        placeholder="Select an option"
      />
    </div>
  );
}
