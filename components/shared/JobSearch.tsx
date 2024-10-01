"use client";

import React, { useEffect, useState } from "react";
import LocalSearchBar from "./search/LocalSearchBar";
import Filter from "./Filter";
import { JobFilters } from "@/constants/filters";
import { Button } from "../ui/button";
import { SearchParamsProps } from "@/types";
import NoResult from "./NoResult";
import JobsCard from "../cards/JobsCard";
import Pagination from "./Pagination";

const JobSearch = ({ searchParams }: SearchParamsProps) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs?filter=${searchParams?.filter || "newest"}&q=${searchParams?.q || "development"}&page=${searchParams?.page || 1}&pageSize=20`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await res.json();
      setJobs(data.results);
      setIsNext(data.isNext);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/jobs"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          extraClasses="flex-1 min-h-[46px]"
          placeholder="Job Title, Company, or Keywords"
        />
        <Filter filters={JobFilters} extraClasses="min-h-[48px]" />
        <Button
          className="primary-gradient min-h-[48px] cursor-pointer text-light-850"
          onClick={fetchJobs}
          disabled={loading}
        >
          Search Jobs
        </Button>
      </div>
      {loading ? (
        <div className="flex-center mt-10 flex-col px-5">
          <div className="loader"></div>
          <p className="text-dark400_light800 body-semibold mt-6">
            Searching for jobs ....
          </p>
        </div>
      ) : error ? (
        <div className="flex-center mt-10 flex-col px-5">
          <p className="text-red-500">{error}</p>
        </div>
      ) : jobs.length > 0 ? (
        jobs.map((job: any) => (
          <JobsCard
            key={job.id}
            role={job.role}
            company_name={job.company_name}
            remote={job.remote}
            employment_type={job.employment_type}
            keywords={job.keywords}
            location={job.location}
            url={job.url}
            text={job.text}
          />
        ))
      ) : (
        <NoResult
          title="No Jobs Found"
          description="Try searching for another job or change your current filter."
        />
      )}
      {!loading && (
        <div className="mt-10">
          <Pagination
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={isNext}
          />
        </div>
      )}
    </div>
  );
};

export default JobSearch;
