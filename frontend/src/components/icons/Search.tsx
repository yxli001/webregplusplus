import { BaseIconProps } from "@/types/icon";

const Search = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4953 13.4953 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4953 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4953 2.5 16.6667 5.67132 16.6667 9.58333Z"
      stroke={color ?? "#717680"}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Search;
