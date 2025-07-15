import { BaseIconProps } from "@/types/icon";

const Moon = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M16.9618 12.7952C16.098 13.1423 15.1546 13.3334 14.1667 13.3334C10.0245 13.3334 6.66667 9.9755 6.66667 5.83336C6.66667 4.84539 6.8577 3.90203 7.20484 3.03821C4.44707 4.14648 2.5 6.84587 2.5 10C2.5 14.1422 5.85786 17.5 10 17.5C13.1542 17.5 15.8536 15.553 16.9618 12.7952Z"
      stroke={color ?? "#717680"}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Moon;
