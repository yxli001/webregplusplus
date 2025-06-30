import { SVGProps } from "react";

type SunProps = {
  size?: number; // Add a size prop
} & SVGProps<SVGSVGElement>;

const Sun = ({ color, size = 16, ...props }: SunProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M10 1V2M10 18V19M19 10H18M2 10H1M16.364 16.364L15.6569 15.6569M4.34315 4.34315L3.63604 3.63604M16.364 3.63609L15.6569 4.3432M4.3432 15.6569L3.63609 16.364M14 10C14 12.2091 12.2091 14 10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10Z"
      stroke={color ?? "#717680"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Sun;
