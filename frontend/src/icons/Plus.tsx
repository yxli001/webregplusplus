import { BaseIconProps } from "@/types/icon";

const Plus = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20" // Define the coordinate system for scaling
    width={size} // Use the size prop for width
    height={size} // Use the size prop for height (square aspect ratio)
    fill="none"
    {...props}
  >
    <path
      d="M9.99984 4.16663V15.8333M4.1665 9.99996H15.8332"
      stroke={color ?? "#717680"}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Plus;
