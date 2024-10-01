import JobSearch from "@/components/shared/JobSearch";
import { SearchParamsProps } from "@/types";
import React from "react";

const page = async ({ searchParams }: SearchParamsProps) => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <JobSearch searchParams={searchParams} />
    </>
  );
};

export default page;
