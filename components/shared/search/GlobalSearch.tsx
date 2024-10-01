"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const modalRef = useRef(null);
  useEffect(() => {
    const handelOutsideClick = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModelIsOpen(false);
        setSearch("");
      }
    };
    setModelIsOpen(false);
    document.addEventListener("click", handelOutsideClick);
    return () => document.removeEventListener("click", handelOutsideClick);
  }, [pathName]);

  useEffect(() => {
    const delayDebouncefn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, {
          scroll: false,
        });
      } else {
        if (query) {
          const newUrl = removeKeyFromQuery({
            params: searchParams.toString(),
            keys: ["global", "type"],
          });
          router.push(newUrl, {
            scroll: false,
          });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebouncefn);
  }, [search, router, pathName, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden "
      ref={modalRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!modelIsOpen) setModelIsOpen(true);
            if (e.target.value === "" && modelIsOpen) {
              setModelIsOpen(false);
            }
          }}
          className="paragraph-regular placeholder no-focus background-light800_darkgradient text-dark400_light700 border-none shadow-none outline-none"
        />
      </div>
      {modelIsOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
