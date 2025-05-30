"use client";

import React from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

type BaseButtonProps = {
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  classNames?: string;
  link?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disableHover?: boolean;
  buttonType?: "primary" | "outline" | "onlyIcon" | "ghost" | "destructive";
  isGray?: boolean;
};

type ButtonWithLabel = BaseButtonProps & {
  onlyIcon?: false;
  label: string | React.ReactNode;
};

type ButtonOnlyIcon = BaseButtonProps & {
  onlyIcon: true;
  label?: never;
};

type ButtonProps = ButtonWithLabel | ButtonOnlyIcon;

const Button: React.FC<ButtonProps> = ({
  label,
  isLoading = false,
  isDisabled = false,
  onClick,
  classNames,
  link,
  leftIcon,
  rightIcon,
  type = "button",
  disableHover,
  buttonType = "primary",
  onlyIcon = false,
}) => {
  const content = isLoading ? <Spinner /> : onlyIcon ? null : label;

  const shouldDisable = isLoading || isDisabled;

  const hoverStyles = disableHover
    ? ""
    : `transition ease-in-out duration-300 hover:opacity-60 hover:bg-blue-600 dark:hover:bg-blue-700`;

  const baseStyles = [
    `flex justify-center text-sm items-center gap-2 rounded-lg border font-semibold w-full py-3 px-4 cursor-pointer duration-300 ease-in-out`,
    hoverStyles,
  ];

  const buttonTypeStyles: Record<string, string> = {
    primary:
      "bg-blue-500 text-white border-transparent hover:bg-blue-600 dark:hover:bg-blue-700",
    outline:
      "bg-transparent text-blue-500 border border-blue-500 rounded-[0.93rem] hover:bg-blue-100 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-700",
    ghost:
      "bg-transparent text-blue-500 w-auto border-transparent !p-0 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-700",
    destructive:
      "bg-red-600 text-white border-transparent hover:bg-red-700 dark:hover:bg-red-800",
    onlyIcon:
      "!w-fit !h-fit bg-transparent !p-0 sm:!p-0 border-transparent hover:bg-blue-100 dark:hover:bg-blue-700",
  };

  const mergedClassNames = twMerge(
    [
      ...baseStyles,
      buttonTypeStyles[buttonType] ?? "",
      classNames,
      shouldDisable ? "opacity-50 cursor-not-allowed" : "",
    ].join(" ")
  );

  const buttonContent = (
    <>
      {leftIcon && <span>{leftIcon}</span>}
      {content}
      {rightIcon && <span>{rightIcon}</span>}
    </>
  );

  if (link) {
    return (
      <Link href={link} passHref className={mergedClassNames} onClick={onClick}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={mergedClassNames}
      onClick={onClick}
      disabled={shouldDisable}
    >
      {buttonContent}
    </button>
  );
};

export default Button;
