import { SVGProps } from "react";

interface UpDownArrowsProps extends SVGProps<SVGSVGElement> {
  size?: number; // Add a size prop
}

const UpDownArrows = ({ color, size = 16, ...props }: UpDownArrowsProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      stroke={color ? color : "#627D98"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 1l4 4H4l4-4ZM8 15l-4-4h8l-4 4Z"
    />
  </svg>
);

export default UpDownArrows;
