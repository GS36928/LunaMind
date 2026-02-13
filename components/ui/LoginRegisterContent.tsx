"use client";

import Link from "next/link";
import { useState } from "react";
import { Hide, Show } from "react-coolicons";
import { Evectus } from "./Icons";

interface LoginRegisterContentInputProps {
  placeholder: string;
  value: string;
  type?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginRegisterContentHeader = () => {
  return (
    <div className="flex items-center gap-2 3xl:pr-48">
      <Evectus />
      <Link href={"/"} className="text-2xl text-[#0C0F21] font-freeman-regular">
        EVECTUS
      </Link>
    </div>
  );
};

export const LoginRegisterContentTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center mt-8 lg:mt-[44px] lg:items-start 3xl:!mt-[64px]">
      <span className="text-[44px] text-[#0C0F21] font-lgvanastasia-regular leading-[100%]">
        {title}
      </span>
      <span className="text-sm text-[#737373] font-helveticaneue-regular leading-5 xl:text-base">
        შეიყვანეთ თქვენი მონაცემები
      </span>
    </div>
  );
};

export const LoginRegisterContentSocial = ({
  authType,
}: {
  authType: string;
}) => {
  return (
    <>
      <div className="pb-8 text-center text-xs text-[#0C0F21] font-helveticaneue-regular leading-4 mt-6 xl:text-sm xl:leading-5">
        გაქვს ანგარიში?
        <Link
          href={`${authType === "რეგისტრაცია" ? "/register" : "/login"}`}
          className="text-[#0077FF] hover:underline leading-4 text-xs xl:text-sm xl:leading-5"
        >
          {authType}
        </Link>
      </div>
    </>
  );
};

export const LoginRegisterContentInput = ({
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
}: LoginRegisterContentInputProps) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full text-[#737373] p-4 border border-[#EBEBEB] rounded-[12px] 
        focus:outline-none text-sm leading-5 font-helveticaneue-regular
        placeholder:font-helveticaneue-regular placeholder:text-[#737373] 
        placeholder:text-sm placeholder:leading-5 xl:text-base xl:leading-6
        ${disabled ? "bg-[#f5f5f5] cursor-not-allowed" : ""}`}
      required
    />
  );
};

export const LoginRegisterContentInputPassword = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-[#737373] p-4 border border-[#EBEBEB] rounded-[12px] focus:outline-none text-sm leading-5 font-helveticaneue-regular
            placeholder:font-helveticaneue-regular placeholder:text-[#737373] placeholder:text-sm placeholder:leading-5
            xl:text-base xl:leading-6"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#737373]"
      >
        {showPassword ? <Hide /> : <Show />}
      </button>
    </div>
  );
};

export const LoginRegisterContentTermsAndPrivacy = ({
  checked,
  onChange,
  text,
  href,
  secondText,
  secondHref,
}: {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  href: string;
  secondText?: string;
  secondHref?: string;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-[18px] h-[18px] rounded-sm border border-[#EBEBEB]"
      />
      <label className="text-sm leading-5 font-helveticaneue-regular text-[#737373] xl:text-base xl:leading-6 flex items-center">
        ვეთანხმები{" "}
        {/* {secondHref && secondText ? (
          <div className="flex flex-col ml-1">
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm leading-5 font-helveticaneue-regular text-[#0077FF] xl:text-base xl:leading-6"
            >
              {text}
            </Link>
            <Link
              href={secondHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm leading-5 font-helveticaneue-regular text-[#0077FF] xl:text-base xl:leading-6"
            >
              {secondText}
            </Link>
          </div> */}
        {/* ) : ( */}
        {/* <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm leading-5 font-helveticaneue-regular text-[#0077FF] xl:text-base xl:leading-6 ml-1"
        >
          {text}
        </Link> */}
        <span className="text-sm leading-5 font-helveticaneue-regular text-[#0077FF] xl:text-base xl:leading-6 ml-1">
          {secondHref && secondText ? (
            <span>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm leading-5 font-helveticaneue-regular text-[#0077FF] xl:text-base xl:leading-6"
              >
                {text}
              </Link>
              <span>, </span>
              <Link
                href={secondHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm leading-5 font-helveticaneue-regular text-[#0077FF] xl:text-base xl:leading-6"
              >
                {secondText}
              </Link>
            </span>
          ) : (
            <span>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm leading-5 font-helveticaneue-regular text-[#0077FF] xl:text-base xl:leading-6"
              >
                {text}
              </Link>
            </span>
          )}
        </span>
        {/* )} */}
      </label>
    </div>
  );
};
