import { SVGProps } from "react";

interface CrossProps extends SVGProps<SVGSVGElement> {
  size?: number; // Add a size prop
}

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
      stroke={color ? color : "#627D98"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 1l14 14M15 1 1 15"
    />
  </svg>
);

export default Cross;
