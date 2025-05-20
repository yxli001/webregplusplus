import Check from "@/icons/Check";

type CheckboxProps = {
  checked: boolean;
  onChange?: () => void;
  className?: string;
  variant?: "dark" | "light";
};

const Checkbox = ({
  checked,
  onChange,
  className = "",
  variant = "light",
}: CheckboxProps) => {
  return (
    <div
      className={`flex h-4 w-4 items-center justify-center p-0.5 ${
        variant === "dark" ? "border-text-dark" : "border-text-light"
      } cursor-pointer rounded ${
        checked
          ? variant === "dark"
            ? "bg-primary-dark"
            : "bg-primary-light"
          : "border bg-transparent"
      } ${className}`}
      onClick={onChange}
    >
      {checked && <Check color="white" />}
    </div>
  );
};

export default Checkbox;
