import TagsCard from "@/components/cards/TagsCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tags.actions";
import React from "react";

const page = async () => {
  const { tags } = await getAllTags({});

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
    </>
  );
};

export default page;
