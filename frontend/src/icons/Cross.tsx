import { SVGProps } from "react";

const Cross = ({ color, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="none"
    {...props}
  >
    <path
      stroke={color || "#627D98"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 13 13 1M1 1l12 12"
    />
  </svg>
);
export default Cross;
