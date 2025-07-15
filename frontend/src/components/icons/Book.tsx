import { BaseIconProps } from "@/types/icon";

const Book = ({ color, size = 16, ...props }: BaseIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20" // Define the coordinate system for scaling
    width={size} // Use the size prop for width
    height={size} // Use the size prop for height (square aspect ratio)
    fill="none"
    {...props}
  >
    <path
      d="M10 5.21061V16.0439M10 5.21061C9.02675 4.56401 7.70541 4.16663 6.25 4.16663C4.79459 4.16663 3.47325 4.56401 2.5 5.21061V16.0439C3.47325 15.3973 4.79459 15 6.25 15C7.70541 15 9.02675 15.3973 10 16.0439M10 5.21061C10.9732 4.56401 12.2946 4.16663 13.75 4.16663C15.2054 4.16663 16.5268 4.56401 17.5 5.21061V16.0439C16.5268 15.3973 15.2054 15 13.75 15C12.2946 15 10.9732 15.3973 10 16.0439"
      stroke={color ?? "#717680"}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Book;
