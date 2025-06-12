import type { SVGProps } from "react";

type SearchProps = {
  size?: number; // Add a size prop
} & SVGProps<SVGSVGElement>;

const Search = ({ color, size = 16, ...props }: SearchProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Use the size prop for width
    height={size} // Keep the height equal to the width for a square aspect ratio
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
      stroke={color ?? "#627D98"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Search;
