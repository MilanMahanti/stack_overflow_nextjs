import QuestionsCard from "@/components/cards/QuestionsCard";
import Filter from "@/components/shared/Filter";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";
import { getAllQuestions } from "@/lib/actions/questions.action";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getRecommendedQuestions } from "@/lib/actions/user.action";
import Pagination from "@/components/shared/Pagination";

export const metadata: Metadata = {
  title: "DevFlow | Home",
  description:
    "Welcome to DevFlow, a collaborative platform for developers to ask questions, share knowledge, and find solutions. Explore the latest programming discussions and stay updated with real-time answers from the community.",
};

const Home = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  let result;

  if (searchParams?.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getAllQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    });
  }
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[42px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          extraClasses="flex-1"
          placeholder="Search questions here..."
        />
        <Filter
          filters={HomePageFilters}
          extraClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex flex-col gap-6">
        {result?.questions.length > 0 ? (
          result?.questions.map((question: any) => (
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
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result?.isNext}
        />
      </div>
    </>
  );
};

export default Home;
