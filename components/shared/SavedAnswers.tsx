import React from "react";
import NoResult from "./NoResult";
import AnswerCard from "../cards/AnswerCard";
import LocalSearchBar from "./search/LocalSearchBar";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getSavedAnswer } from "@/lib/actions/user.action";
import Pagination from "./Pagination";

interface SavedQuestionProps {
  searchParams: any;
  userId: string;
}

const SavedAnswers = async ({ searchParams, userId }: SavedQuestionProps) => {
  const { savedAnswers, isNext: isNextAnswer } = await getSavedAnswer({
    clerkId: userId,
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: searchParams?.page ? +searchParams?.page : 1,
  });
  return (
    <>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          extraClasses="flex-1"
          placeholder="Search questions here..."
        />
        <Filter
          filters={AnswerFilters}
          extraClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex flex-col gap-6">
        {savedAnswers?.length > 0 ? (
          savedAnswers?.map((answer: any) => (
            <AnswerCard
              key={answer._id}
              _id={answer._id}
              author={answer.author}
              upvotes={answer.upvotes.length}
              createdAt={answer.createdAt}
              question={answer.question}
              answer={answer.answer}
            />
          ))
        ) : (
          <NoResult
            title="There’s no saved answers to show"
            description="Save answers to get easier access to them later"
            link="/"
            linkText="Go back to Home"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNextAnswer}
        />
      </div>
    </>
  );
};

export default SavedAnswers;
