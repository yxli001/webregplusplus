import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { IconComponent } from "@/types/icon";

type IconButtonProps = {
  icon: IconComponent | ReactNode;
  iconSize?: number;
  iconColor?: string;
  iconFill?: string;
  onClick?: () => void;
  className?: string;
};

const IconButton = ({
  icon: Icon,
  onClick,
  className,
  iconColor = undefined,
  iconSize = 20,
  iconFill = "none",
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={twMerge(
        "rounded-lg bg-background p-2 hover:cursor-pointer hover:bg-gray-100",
        className,
      )}
    >
      {typeof Icon === "function" ? (
        <Icon size={iconSize} color={iconColor} fill={iconFill} />
      ) : (
        Icon
      )}
    </button>
  );
};

export default IconButton;
