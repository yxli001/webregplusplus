"use client";
import { ReactNode } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { twMerge } from "tailwind-merge";

type Props = {
  left: ReactNode; // filters / search / course cards
  center: ReactNode; // calendar or other main canvas
  right: ReactNode; // alternate schedules list
  className?: string;
};

export default function ThreePane({
  left,
  center,
  right,
  className = "",
}: Props) {
  return (
    <div
      className={twMerge(
        /* subtract navbar height, but never let content push page height */
        "flex h-[calc(100vh-5rem)]",
        className,
      )}
    >
      <PanelGroup direction="horizontal" className="h-full">
        {/* ───── Left column ───── */}
        <Panel defaultSize={20} minSize={20} maxSize={35}>
          {left} {/* your search / added tab UI */}
        </Panel>
        <PanelResizeHandle className="group relative w-3 cursor-col-resize border-l" />
        {/* ───── Middle canvas ───── */}
        <Panel defaultSize={50} minSize={30}>
          {center}
        </Panel>
        <PanelResizeHandle className="group relative w-3 cursor-col-resize border-r" />
        {/* ───── Right column ───── */}
        <Panel defaultSize={25} minSize={25} maxSize={35}>
          {right}
        </Panel>
      </PanelGroup>
    </div>
  );
}
