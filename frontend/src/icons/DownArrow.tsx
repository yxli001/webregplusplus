import { SVGProps } from "react";

type DownArrowProps = {
  size?: number;
} & SVGProps<SVGSVGElement>;

const DownArrow = ({ color, size = 16, ...props }: DownArrowProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 14 8"
    fill="none"
    {...props}
  >
    <path
      d="M1 1L7 7L13 1"
      stroke={color ?? "#717680"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default DownArrow;
