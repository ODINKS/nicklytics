"use client";
import LetterIcon from "@/components/svgs/LetterIcon";
import { useState } from "react";
import { FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import ErrorDisplayer from "../ErrorDisplayer";

interface InputFieldProps {
  label?: string;
  labelType?: "standard" | "collapsed";
  collasedLabelStyles?: string;
  name: string;
  id?: string;
  type?: "text" | "password" | "email" | "checkbox" | "switch" | "radio";
  required?: boolean;
  placeholder?: string;
  value?: string | boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  classNames?: string;
  visibilityToggle?: boolean;
  disabled?: boolean;
  error?: string;
  checkboxLabelPosition?: "left" | "right";
  checkboxLabelStyles?: string;
  thumbColor?: string;
  trackColor?: string;
  trackColorChecked?: string;
  maxLength?: number;
  minLength?: number;
  autoFocus?: boolean;
  switchLabel?: string;
  parentStyles?: string;
  outerRadioStyles?: string;
  innerRadioStyles?: string;
  radioLabel?: string;
  radioLabelPosition?: "left" | "right";
  ref?:
    | ((instance: HTMLInputElement | null) => void)
    | null
    | React.RefObject<HTMLInputElement>;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  labelType = "standard",
  collasedLabelStyles,
  name,
  id,
  type = "text",
  required = false,
  placeholder = "",
  value,
  onChange,
  onBlur,
  onFocus,
  onInput,
  onKeyDown,
  classNames = "",
  visibilityToggle = true,
  disabled = false,
  error = "",
  thumbColor,
  trackColor = "#d1d5db",
  trackColorChecked = "#184B55",
  maxLength,
  minLength,
  autoFocus,
  switchLabel,
  parentStyles,
  outerRadioStyles,
  innerRadioStyles,
  radioLabel,
  radioLabelPosition,
  ref,
  inputMode,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const shouldShrink =
    isFocused || (typeof value === "string" && value?.length > 0);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const renderInput = () => {
    switch (type) {
      case "checkbox":
        return (
          <div className="relative w-fit h-fit">
            <input
              id={id}
              name={name}
              type="checkbox"
              checked={value as boolean}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              onInput={onInput}
              disabled={disabled}
              className={twMerge(
                "w-6 h-6 peer cursor-pointer checked:bg-blue-600 appearance-none border border-gray-300 rounded-[6px] dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-blue-500",
                classNames
              )}
            />
            <FiCheck className="absolute left-1.5 top-[7px] opacity-0 peer-checked:opacity-100 pointer-events-none text-white" />
          </div>
        );

      case "switch":
        return (
          <div className="flex items-center">
            <div className="relative inline-block w-12 h-6 mr-2 align-middle select-none">
              <input
                id={id}
                name={name}
                type="checkbox"
                checked={value as boolean}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                onInput={onInput}
                disabled={disabled}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full border border-gray-300 shadow-sm appearance-none cursor-pointer transition-transform duration-300 ${
                  thumbColor ? thumbColor : "bg-white"
                } ${
                  value ? "translate-x-6" : "translate-x-0"
                } dark:border-gray-600 dark:bg-gray-700`}
              />
              <label
                htmlFor={name || id}
                className={`block w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer dark:bg-gray-700`}
                style={{
                  backgroundColor: value ? trackColorChecked : trackColor,
                }}
              />
            </div>
            {switchLabel && (
              <label
                htmlFor={name}
                className="text-sm text-gray-900 dark:text-gray-300"
              >
                {switchLabel}
              </label>
            )}
          </div>
        );

      case "radio":
        return (
          <label
            htmlFor={id}
            className={`flex items-center ${
              radioLabelPosition === "left" ? "flex-row-reverse" : ""
            } cursor-pointer space-x-2`}
          >
            <div className="relative">
              <input
                type="radio"
                id={id}
                name={name}
                value={id}
                checked={value === id}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                onInput={onInput}
                onKeyDown={onKeyDown}
                disabled={disabled}
                className="sr-only"
              />
              <div
                className={twMerge(
                  `w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ease-in-out ${
                    value === id ? "border-blue-500" : "border-gray-300"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
                  outerRadioStyles
                )}
              >
                <div
                  className={twMerge(
                    `w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                      value === id ? "bg-blue-500" : "bg-gray-400"
                    }`,
                    innerRadioStyles
                  )}
                />
              </div>
            </div>
            {label && (
              <span className="text-sm text-gray-900 dark:text-gray-300">
                {label}
              </span>
            )}
            {radioLabel && (
              <label className="text-blue-500 font-medium">{radioLabel}</label>
            )}
          </label>
        );

      default:
        return (
          <div className="w-full relative">
            <input
              id={id}
              name={name}
              type={
                type === "password"
                  ? isPasswordVisible
                    ? "text"
                    : "password"
                  : type
              }
              placeholder={placeholder}
              value={value as string}
              onChange={onChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onInput={onInput}
              onKeyDown={onKeyDown}
              required={required}
              disabled={disabled}
              autoFocus={autoFocus}
              className={twMerge(
                `w-full px-5 py-4 rounded-lg text-black placeholder:text-gray-400 placeholder:text-sm text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-400`,
                error
                  ? "border border-red-500 bg-red-50 dark:bg-red-900"
                  : "border border-gray-300 dark:border-gray-600",
                classNames
              )}
              ref={ref}
              minLength={minLength}
              maxLength={maxLength}
              inputMode={inputMode}
            />
            {type === "password" && visibilityToggle && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            )}
            {type === "email" && (
              <LetterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={twMerge(
        "relative",
        type === "checkbox" || type === "switch" ? "w-fit h-fit" : "w-full",
        parentStyles
      )}
    >
      {labelType === "standard" &&
        label &&
        type !== "checkbox" &&
        type !== "switch" && (
          <label
            htmlFor={name}
            className={twMerge(
              "block text-sm text-gray-900 dark:text-gray-300 mb-2"
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
      {labelType === "collapsed" &&
        label &&
        type !== "checkbox" &&
        type !== "switch" && (
          <label
            htmlFor={id}
            className={twMerge(
              `absolute left-[13px] transition-all text-sm px-1 rounded-md`,
              shouldShrink
                ? " -top-2.5 text-black bg-white dark:text-gray-300 dark:bg-gray-800"
                : "top-5 text-gray-400 !bg-inherit",
              collasedLabelStyles
            )}
          >
            {label}
          </label>
        )}
      {renderInput()}
      {error && <ErrorDisplayer error={error} />}
    </div>
  );
};

export default InputField;
