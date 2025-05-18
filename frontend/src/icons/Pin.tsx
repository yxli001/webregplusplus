import { SVGProps } from "react";

interface PinProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const Pin = ({ color, size = 16, ...props }: PinProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M15 4.5L11 8.5L7 10L5.5 11.5L12.5 18.5L14 17L15.5 13L19.5 9"
      stroke={color ? color : "#627D98"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 15L4.5 19.5"
      stroke={color ? color : "#627D98"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 4L20 9.5"
      stroke={color ? color : "#627D98"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default Pin;
