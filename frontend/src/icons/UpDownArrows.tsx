import { SVGProps } from "react";

type UpDownArrowsProps = {
  size?: number; // Add a size prop
} & SVGProps<SVGSVGElement>;

const UpDownArrows = ({ color, size = 16, ...props }: UpDownArrowsProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 10 16"
    fill="none"
    {...props}
  >
    <path
      stroke={color ?? "#627D98"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m1 5 4-4 4 4m0 6-4 4-4-4"
    />
  </svg>
);

export default UpDownArrows;
