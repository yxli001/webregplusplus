import { twMerge } from "tailwind-merge";

import Check from "@/components/icons/Check";
import Minus from "@/components/icons/Minus";

type CheckboxProps = {
  checked?: boolean | undefined;
  onChange?: (next: boolean) => void;
  className?: string;
};

/**
 * Checkbox component that can be checked, unchecked, or in an indeterminate state.
 * The indeterminate state is explicitly set
 *
 * @param checked - Whether the checkbox is checked
 * @param onChange - Callback function when the checkbox is clicked
 * @param className - Additional class names to apply to the checkbox
 * @returns
 */
const Checkbox = ({ checked, onChange, className = "" }: CheckboxProps) => {
  const handleClick = () => {
    // if indeterminate, toggle to unchecked
    const next = checked === undefined ? false : !checked;

    onChange?.(next);
  };

  return (
    <div
      role="checkbox"
      aria-checked={checked ?? "mixed"}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={twMerge(
        "flex h-5 w-5 flex-shrink-0 cursor-pointer appearance-none items-center justify-center rounded border border-border p-0.5 focus:outline-4 focus:outline-offset-4 focus:outline-primary-light",
        checked === undefined || checked
          ? "bg-primary-light hover:bg-primary-dark"
          : "",
        className,
      )}
    >
      {checked === undefined ? (
        <Minus color="white" />
      ) : checked ? (
        <Check color="white" />
      ) : null}
    </div>
  );
};

export default Checkbox;
