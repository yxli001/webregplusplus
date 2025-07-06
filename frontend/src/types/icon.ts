import { SVGProps } from "react";

export type BaseIconProps = {
  size?: number;
} & SVGProps<SVGSVGElement>;

export type IconComponent = React.ComponentType<BaseIconProps>;
