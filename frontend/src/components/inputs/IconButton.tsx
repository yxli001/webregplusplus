import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { IconComponent } from "@/types/icon";

type IconButtonProps = {
  icon: IconComponent | ReactNode;
  iconSize?: number;
  iconColor?: string;
  iconFill?: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  tooltip?: string;
  tooltipPosition?: "top" | "left" | "right" | "bottom";
  outlined?: boolean;
};

const IconButton = ({
  icon: Icon,
  onClick,
  className,
  iconColor = undefined,
  iconSize = 20,
  iconFill = "none",
  active = false,
  tooltip,
  tooltipPosition = "bottom",
  outlined = false,
}: IconButtonProps) => {
  const getTooltipPositionClasses = () => {
    switch (tooltipPosition) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "bottom":
      default:
        return "top-full left-1/2 -translate-x-1/2 mt-2";
    }
  };

  return (
    <div className="group relative">
      <button
        onClick={onClick}
        type="button"
        className={twMerge(
          "flex aspect-square items-center justify-center rounded-lg bg-background p-2 hover:cursor-pointer hover:bg-foreground",
          active && "bg-foreground",
          outlined && "border border-gray-300",
          className,
        )}
      >
        {typeof Icon === "function" ? (
          <Icon size={iconSize} color={iconColor} fill={iconFill} />
        ) : (
          Icon
        )}
      </button>

      {tooltip && (
        <div
          className={twMerge(
            "pointer-events-none absolute z-50 overflow-visible whitespace-nowrap rounded-lg bg-black px-3 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100",
            getTooltipPositionClasses(),
          )}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default IconButton;
