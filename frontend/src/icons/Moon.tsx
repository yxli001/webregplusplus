import { SVGProps } from "react";

type MoonProps = {
  size?: number; // Add a size prop
} & SVGProps<SVGSVGElement>;

const Moon = ({ color, size = 16, ...props }: MoonProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M18.3542 13.3542C17.3176 13.7708 16.1856 14.0001 15 14.0001C10.0294 14.0001 6 9.97062 6 5.00006C6 3.81449 6.22924 2.68246 6.64581 1.64587C3.33648 2.9758 1 6.21507 1 10.0001C1 14.9706 5.02944 19.0001 10 19.0001C13.785 19.0001 17.0243 16.6636 18.3542 13.3542Z"
      stroke={color ?? "#717680"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Moon;
