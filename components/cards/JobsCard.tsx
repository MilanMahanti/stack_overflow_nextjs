/* eslint-disable camelcase */
import { ArrowTopRightIcon, ClockIcon, HomeIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";
import { extractTextFromHTML } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface JobCardProps {
  role: string;
  company_name: string;
  location: string | null;
  remote: boolean;
  url: string;
  text: string;
  keywords: [];
  employment_type: string | null;
}

const JobsCard = ({
  role,
  company_name,
  location,
  remote,
  url,
  text,
  keywords,
  employment_type,
}: JobCardProps) => {
  return (
    <div className="card-wrapper light-border mt-8 w-full rounded-[10px] border px-9  py-8 dark:border-none sm:px-11 ">
      <div className="flex items-start gap-4">
        <div className="background-light800_dark300 flex size-[64px] shrink-0 items-center justify-center rounded-md shadow-sm">
          <Image
            src="/assets/icons/devflow_logo.svg"
            alt="logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="base-semibold text-dark200_light900 line-clamp-2 flex-1">
              {role}
            </h2>
            <p className="body-medium background-light800_dark300 hover:background-light700_dark400 card-custom-shadow max-h-fit w-fit grow-0 rounded-md border-none px-2 py-1 capitalize text-primary-500 transition-colors ease-linear">
              {company_name}
            </p>
          </div>
          <p className="body-regular text-dark500_light700 my-4">
            {extractTextFromHTML(text)}
          </p>
          <div className="mb-2 flex flex-wrap gap-3">
            {keywords.length > 0 && keywords.length > 5
              ? keywords.slice(0, 5).map((tag, i) => (
                  <Badge
                    className="subtle-medium background-light800_dark300 text-light400_light500 hover:background-light700_dark400 card-custom-shadow rounded-md border-none px-4 py-2 uppercase transition-colors ease-linear"
                    key={i}
                  >
                    {tag}
                  </Badge>
                ))
              : keywords.map((tag, i) => (
                  <Badge
                    className="subtle-medium background-light800_dark300 text-light400_light500 hover:background-light700_dark400 card-custom-shadow rounded-md border-none px-4 py-2 uppercase transition-colors ease-linear"
                    key={i}
                  >
                    {tag}
                  </Badge>
                ))}
          </div>
          {location && (
            <p className="text-dark400_light700 text-[12px] underline">
              {location}
            </p>
          )}
          <div className="mt-4 flex w-full justify-between max-sm:flex-col-reverse">
            <Link
              href={url}
              target="_blank"
              className="body-semibold group flex items-center gap-2 justify-self-end text-primary-500"
            >
              View Job{" "}
              <ArrowTopRightIcon className="invert-colors size-[14px] transition-transform duration-300 group-hover:-translate-y-1" />
            </Link>
            <div className="flex gap-3">
              {remote && (
                <div className="flex items-center gap-2">
                  <HomeIcon className="size-[16px] text-light-500" />
                  <p className="body-medium text-light-500">Remote</p>
                </div>
              )}
              {employment_type && (
                <div className="flex items-center gap-2">
                  <ClockIcon className="size-[16px] text-light-500" />
                  <p className="body-medium text-light-500">
                    {employment_type}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsCard;
