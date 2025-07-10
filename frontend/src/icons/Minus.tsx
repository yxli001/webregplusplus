import { BaseIconProps } from "@/types/icon";

const Minus = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 14 14"
    fill="none"
    {...props}
  >
    <path
      d="M2.9165 7H11.0832"
      stroke={color ?? "#717680"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Minus;
