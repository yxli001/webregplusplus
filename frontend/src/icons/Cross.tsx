import type { SVGProps } from "react";

type CrossProps = {
  size?: number; // Add a size prop
} & SVGProps<SVGSVGElement>;

const Cross = ({ color, size = 16, ...props }: CrossProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      d="M1 13L13 1M1 1L13 13"
      stroke={color ?? "#627D98"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Cross;
