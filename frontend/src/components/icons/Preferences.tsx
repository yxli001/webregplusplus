import { BaseIconProps } from "@/types/icon";

const Preferences = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20" // Define the coordinate system for scaling
    width={size} // Use the size prop for width
    height={size} // Use the size prop for height (square aspect ratio)
    fill="none"
    {...props}
  >
    <path
      d="M10.0002 5.00004V3.33337M10.0002 5.00004C9.07969 5.00004 8.3335 5.74623 8.3335 6.66671C8.3335 7.58718 9.07969 8.33337 10.0002 8.33337M10.0002 5.00004C10.9206 5.00004 11.6668 5.74623 11.6668 6.66671C11.6668 7.58718 10.9206 8.33337 10.0002 8.33337M5.00016 15C5.92064 15 6.66683 14.2538 6.66683 13.3334C6.66683 12.4129 5.92064 11.6667 5.00016 11.6667M5.00016 15C4.07969 15 3.3335 14.2538 3.3335 13.3334C3.3335 12.4129 4.07969 11.6667 5.00016 11.6667M5.00016 15V16.6667M5.00016 11.6667V3.33337M10.0002 8.33337V16.6667M15.0002 15C15.9206 15 16.6668 14.2538 16.6668 13.3334C16.6668 12.4129 15.9206 11.6667 15.0002 11.6667M15.0002 15C14.0797 15 13.3335 14.2538 13.3335 13.3334C13.3335 12.4129 14.0797 11.6667 15.0002 11.6667M15.0002 15V16.6667M15.0002 11.6667V3.33337"
      stroke={color ?? "#717680"}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Preferences;
