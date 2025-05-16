interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const Button = ({
  label,
  onClick = () => {},
  className = "",
  icon,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-text-lighter bg-primary-dark font-semibold p-3 rounded-md hover:cursor-pointer flex items-center gap-2 ${className}`}
    >
      {icon && icon}
      {label}
    </button>
  );
};

export default Button;
