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
        "/* subtract navbar height */ flex h-[calc(100vh-4rem)]",
        className,
      )}
    >
      <PanelGroup direction="horizontal" className="h-full">
        {/* ───── Left column ───── */}
        <Panel defaultSize={20} minSize={20} maxSize={35}>
          {left} {/* your search / added tab UI */}
        </Panel>
        <PanelResizeHandle className="group relative w-3 cursor-col-resize border">
          {/* Centered dot group */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-1">
              {/* dot 1 */}
              <div className="h-1 w-1 rounded-full bg-gray-400 group-hover:bg-gray-600" />
              {/* dot 2 */}
              <div className="h-1 w-1 rounded-full bg-gray-400 group-hover:bg-gray-600" />
              {/* dot 3 */}
              <div className="h-1 w-1 rounded-full bg-gray-400 group-hover:bg-gray-600" />
            </div>
          </div>
        </PanelResizeHandle>
        {/* ───── Middle canvas ───── */}
        <Panel defaultSize={50} minSize={30}>
          {center}
        </Panel>
        <PanelResizeHandle className="group relative w-3 cursor-col-resize border">
          {/* Centered dot group */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-1">
              {/* dot 1 */}
              <div className="h-1 w-1 rounded-full bg-gray-400 group-hover:bg-gray-600" />
              {/* dot 2 */}
              <div className="h-1 w-1 rounded-full bg-gray-400 group-hover:bg-gray-600" />
              {/* dot 3 */}
              <div className="h-1 w-1 rounded-full bg-gray-400 group-hover:bg-gray-600" />
            </div>
          </div>
        </PanelResizeHandle>
        {/* ───── Right column ───── */}
        <Panel defaultSize={25} minSize={25} maxSize={35}>
          {right}
        </Panel>
      </PanelGroup>
    </div>
  );
}
