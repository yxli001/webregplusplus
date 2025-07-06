import { BaseIconProps } from "@/types/icon";

const Check = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20" // Define the coordinate system for scaling
    width={size} // Use the size prop for width
    height={size} // Use the size prop for height (square aspect ratio)
    fill="none"
    {...props}
  >
    <path
      d="M16.6668 5L7.50016 14.1667L3.3335 10"
      stroke={color ?? "#717680"}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Check;
