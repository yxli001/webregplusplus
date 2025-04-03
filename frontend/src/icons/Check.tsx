import { SVGProps } from "react";

interface CheckProps extends SVGProps<SVGSVGElement> {
  size?: number; // Add a size prop
}

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
      stroke={color ? color : "#627D98"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m1 7 4 4L15 1"
    />
  </svg>
);

export default Check;
