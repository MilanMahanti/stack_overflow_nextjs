"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
interface props {
  filters: {
    name: string;
    value: string;
  }[];
  extraClasses?: string;
  containerClasses?: string;
}
const Filter = ({ filters, extraClasses, containerClasses }: props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramFilter = searchParams.get("filter");
  const handelClick = (item: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: item,
    });

    router.push(newUrl, {
      scroll: false,
    });
  };
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handelClick}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`${extraClasses} body-regular light-border background-light800_dark300 text-dark500_light700 px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem
                key={filter.name}
                value={filter.value}
                className="cursor-pointer"
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
