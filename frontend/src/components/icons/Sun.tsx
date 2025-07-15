import { BaseIconProps } from "@/types/icon";

const Sun = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M10 2.5V3.33333M10 16.6667V17.5M17.5 10H16.6667M3.33333 10H2.5M15.3033 15.3033L14.714 14.714M5.28595 5.28595L4.6967 4.6967M15.3033 4.69674L14.7141 5.286M5.286 14.7141L4.69674 15.3033M13.3333 10C13.3333 11.8409 11.8409 13.3333 10 13.3333C8.15905 13.3333 6.66667 11.8409 6.66667 10C6.66667 8.15905 8.15905 6.66667 10 6.66667C11.8409 6.66667 13.3333 8.15905 13.3333 10Z"
      stroke={color ?? "#717680"}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Sun;
