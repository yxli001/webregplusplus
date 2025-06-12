import type { SVGProps } from "react";

type CheckProps = {
  size?: number; // Add a size prop
} & SVGProps<SVGSVGElement>;

const Check = ({ color, size = 16, ...props }: CheckProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 12" // Define the coordinate system for scaling
    width={size} // Use the size prop for width
    height={size} // Use the size prop for height (square aspect ratio)
    fill="none"
    {...props}
  >
    <path
      d="M1 7L5 11L15 1"
      stroke={color ?? "#627D98"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Check;
