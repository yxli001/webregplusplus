import { twMerge } from "tailwind-merge";

import { IconComponent } from "@/types/icon";

type ButtonGroupProps = {
  buttons: {
    label: string;
    active?: boolean;
    icon?: IconComponent;
    onClick?: () => void;
  }[];
  className?: string;
};

const ButtonGroup = ({ buttons, className }: ButtonGroupProps) => {
  return (
    <div
      className={twMerge(
        "flex w-fit rounded-lg border border-border shadow-xs",
        className,
      )}
    >
      {buttons.map((button, index) => (
        <button
          type="button"
          key={button.label}
          onClick={button.onClick}
          className={twMerge(
            "flex items-center gap-2 px-4 py-[10px] text-text-dark hover:bg-foreground",
            index !== 0 ? "border-l border-border" : "",
            button.active ? "bg-foreground text-text-darker" : "",
          )}
        >
          {button.icon && (
            <button.icon
              size={20}
              color={button.active ? "#252B37" : undefined}
            />
          )}
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
