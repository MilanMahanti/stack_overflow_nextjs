import TagsCard from "@/components/cards/TagsCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tags.action";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "DevFlow | Tags",
  description:
    "Browse and explore topics by tags on DevFlow. Find questions and discussions related to specific programming languages, frameworks, and tools.",
};

const page = async ({ searchParams }: SearchParamsProps) => {
  const { tags, isNext } = await getAllTags({
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          extraClasses="flex-1"
          placeholder="Search tags here..."
        />
        <Filter
          filters={TagFilters}
          extraClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-wrap gap-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <TagsCard
              key={tag._id}
              _id={tag._id}
              followers={tag.followers}
              name={tag.name}
              questions={tag.questions}
              description={tag.description}
            />
          ))
        ) : (
          <NoResult
            title="There's no Tag to show"
            description="Be the first one to ask a question"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
};

export default page;
