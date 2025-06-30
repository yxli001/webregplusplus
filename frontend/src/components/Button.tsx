import { twMerge } from "tailwind-merge";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
};

const Button = ({ label, onClick, className = "", icon }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-2 rounded-xl bg-primary-light px-4 py-3 text-sm font-semibold text-text-lighter shadow-sm hover:cursor-pointer hover:bg-primary-dark",
        className,
      )}
    >
      {icon && icon}
      {label}
    </button>
  );
};

export default Button;
