"use client";

import Image from "next/image";
import Link from "next/link";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

import Button from "../inputs/Button";
import DropdownSelect from "../inputs/DropdownSelect";
import IconButton from "../inputs/IconButton";

import { getQuarters } from "@/api/courses";
import Feedback from "@/components/icons/Feedback";
import Sun from "@/components/icons/Sun";
import Tutorial from "@/components/icons/Tutorial";
import { usePreferenceStore } from "@/hooks/usePreferenceStore";
import { Quarter } from "@/types/course";
import { convertToQuarterFullName } from "@/util/helper";

const Navbar = () => {
  const toast = useRef<Toast>(null);

  const [loadingQuarters, setLoadingQuarters] = useState(false);
  const [allQuarters, setAllQuarters] = useState<Quarter[]>([]);

  const selectedQuarter = usePreferenceStore((state) => state.selectedQuarter);
  const setSelectedQuarter = usePreferenceStore(
    (state) => state.setSelectedQuarter,
  );

  const fetchQuarters = async () => {
    setLoadingQuarters(true);
    const res = await getQuarters();

    if (!res.success) {
      setLoadingQuarters(false);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: res.error || "Failed to fetch quarters. ",
      });

      return;
    }

    setAllQuarters(res.data);
    // Only set default quarter if none is selected
    if (!selectedQuarter && res.data.length > 0) {
      setSelectedQuarter(res.data[0].name);
    }
    setLoadingQuarters(false);
  };

  useEffect(() => {
    void fetchQuarters();
  }, []);

  return (
    <div className="flex w-full items-center justify-between border-b border-border bg-background px-6 py-4">
      <Link className="flex items-center gap-3 hover:cursor-pointer" href="/">
        <Image src="/icon.svg" alt="Icon" width={32} height={32} />
        <h1 className="text-2xl font-bold text-[#181D27]">Webreg++</h1>
      </Link>
      <DropdownSelect
        className="w-fit"
        options={allQuarters.map((quarter) => ({
          label: convertToQuarterFullName(quarter.name),
          value: quarter.name,
        }))}
        value={selectedQuarter}
        onChange={(value) => {
          setSelectedQuarter(value);
        }}
        loading={loadingQuarters}
        closeOnSelect
      />
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <IconButton icon={Sun} />
          <IconButton icon={Feedback} />
          <IconButton icon={Tutorial} />
        </div>
        <div className="flex items-center gap-3">
          <Button label="Log in" />
          <Button label="Sign up" variant="secondary" />
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default Navbar;
