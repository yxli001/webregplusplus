import { SVGProps } from "react";

const UpDownArrows = ({ color, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    {...props}
  >
    <path
      stroke={color || "#627D98"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m1 5 4-4 4 4m0 6-4 4-4-4"
    />
  </svg>
);
export default UpDownArrows;
