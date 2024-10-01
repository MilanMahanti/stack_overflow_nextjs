"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");
  useEffect(() => {
    const delayDebouncefn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, {
          scroll: false,
        });
      } else {
        if (pathName === route) {
          const newUrl = removeKeyFromQuery({
            params: searchParams.toString(),
            keys: ["q"],
          });
          router.push(newUrl, {
            scroll: false,
          });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebouncefn);
  }, [search, route, router, pathName, searchParams, query]);
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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular placeholder no-focus background-light800_darkgradient text-dark400_light700 border-none shadow-none outline-none"
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
