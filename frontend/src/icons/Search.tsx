import { SVGProps } from "react";

interface SearchProps extends SVGProps<SVGSVGElement> {
  size?: number; // Add a size prop
}

const Search = ({ color, size = 16, ...props }: SearchProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <circle
      cx="7"
      cy="7"
      r="6"
      stroke={color ? color : "#627D98"}
      strokeWidth={2}
    />
    <path
      stroke={color ? color : "#627D98"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 11l4 4"
    />
  </svg>
);

export default Search;
