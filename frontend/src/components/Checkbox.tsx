import Check from "@/icons/Check";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
  variant?: "dark" | "light";
}

const Checkbox = ({
  checked,
  onChange,
  className = "",
  variant = "light",
}: CheckboxProps) => {
  return (
    <div
      className={`w-4 h-4 p-0.5 flex items-center justify-center border ${
        variant === "dark" ? "border-text-dark" : "border-text-light"
      } rounded cursor-pointer ${
        checked
          ? variant === "dark"
            ? "bg-primary-dark"
            : "bg-primary-light"
          : "bg-transparent"
      } ${className}`}
      onClick={onChange}
    >
      {checked && <Check color="white" />}
    </div>
  );
};

export default Checkbox;
