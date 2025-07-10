import { BaseIconProps } from "@/types/icon";

const Cross = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M14.1668 5.83337L5.8335 14.1667M5.8335 5.83337L14.1668 14.1667"
      stroke={color ?? "#717680"}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Cross;
