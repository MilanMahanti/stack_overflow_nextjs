"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

interface customInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  extraClasses?: string;
  placeholder: string;
}

export default function LocalSearchBar({
  route,
  iconPosition,
  imgSrc,
  extraClasses,
  placeholder,
}: customInputProps) {
  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ${extraClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        // value=""
        className="paragraph-regular placeholder no-focus text-dark400_light700 border-none bg-transparent shadow-none outline-none "
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
}
