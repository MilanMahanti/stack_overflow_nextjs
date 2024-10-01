import React from "react";
import LocalSearchBar from "./search/LocalSearchBar";
import Filter from "./Filter";
import { QuestionFilters } from "@/constants/filters";
import QuestionsCard from "../cards/QuestionsCard";
import NoResult from "./NoResult";
import { getSavedQuestion } from "@/lib/actions/user.action";
import Pagination from "./Pagination";

interface SavedQuestionProps {
  searchParams: any;
  userId: string;
}

const SavedQuestions = async ({ searchParams, userId }: SavedQuestionProps) => {
  const { savedQuestions, isNext } = await getSavedQuestion({
    clerkId: userId,
    searchQuery: searchParams?.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
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
          filters={QuestionFilters}
          extraClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex flex-col gap-6">
        {savedQuestions?.length > 0 ? (
          savedQuestions?.map((question: any) => (
            <QuestionsCard
              key={question._id}
              _id={question._id}
              answers={question.answers.length}
              title={question.title}
              author={question.author}
              views={question.views}
              upvotes={question.upvotes.length}
              createdAt={question.createdAt}
              tags={question.tags}
            />
          ))
        ) : (
          <NoResult
            title="There’s no saved question to show"
            description="Save questions to get easier access to them later"
            link="/"
            linkText="Go back to Home"
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

export default SavedQuestions;
