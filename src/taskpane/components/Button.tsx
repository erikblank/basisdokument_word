import cx from "classnames";
import React from "react";
import { FC, ReactNode } from "react";

export interface ButtonProps {
  icon?: any;
  bgColor?: string;
  textColor?: string;
  size?: "xs" | "sm" | "md" | "lg";
  onClick?: () => void;
  children?: ReactNode;
  disabled?: boolean;
  hasText?: boolean;
  alternativePadding?: string;
  gap?: string;
  position?: "start" | "end";
}

export const Button: FC<ButtonProps> = ({
  icon,
  bgColor = "bg-darkGrey hover:bg-mediumGrey",
  textColor = "text-white",
  size = "md",
  disabled = false,
  alternativePadding = "",
  onClick,
  children,
  position = "start",
}) => {
  return (
    <button
      onClick={onClick}
      className={cx(
        `flex items-center justify-center text-center rounded-lg transition-all
        ${size} text-${size} ${bgColor} ${alternativePadding}
        ${textColor}`,
        {
          disabled: disabled,
          "flex-row-reverse": position === "end",
          "gap-2": !!icon,
        }
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
