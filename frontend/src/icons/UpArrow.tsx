import { BaseIconProps } from "@/types/icon";

const UpArrow = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M5 12.5L10 7.5L15 12.5"
      stroke={color ?? "#717680"}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default UpArrow;
