import { twMerge } from "tailwind-merge";

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
};

const Button = ({
  label,
  onClick,
  className = "",
  icon,
  variant = "primary",
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm hover:cursor-pointer focus:outline-2 focus:outline-offset-4",
        variant === "primary" &&
          "bg-primary-light text-text-lighter hover:bg-primary-dark",
        variant === "secondary" &&
          "border border-border bg-background text-text-dark hover:bg-foreground",
        className,
      )}
    >
      {icon && icon}
      {label}
    </button>
  );
};

export default Button;
