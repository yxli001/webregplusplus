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
      className={`flex items-center gap-2 rounded-md bg-primary-dark p-3 font-semibold text-text-lighter hover:cursor-pointer ${className}`}
    >
      {icon && icon}
      {label}
    </button>
  );
};

export default Button;
