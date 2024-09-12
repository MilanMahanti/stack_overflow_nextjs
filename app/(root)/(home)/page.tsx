import QuestionsCard from "@/components/cards/QuestionsCard";
import Filter from "@/components/shared/Filter";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";

const questions = [
  {
    _id: "1",
    title: "How to center a div?",
    tags: [
      {
        _id: "1",
        value: "Python",
      },
      {
        _id: "2",
        value: "Css",
      },
      {
        _id: "3",
        value: "React",
      },
    ],
    author: {
      _id: "16",
      name: "John Doe",
      image: "/assets/icons/avatar.svg",
    },
    upvotes: 1298,
    views: 12883,
    answers: 30,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to delete a table in SQL?",
    tags: [
      {
        _id: "1",
        value: "SQL",
      },
      {
        _id: "2",
        value: "Python",
      },
      {
        _id: "3",
        value: "Java",
      },
    ],
    author: {
      _id: "167",
      name: "John Doe",
      image: "/assets/icons/avatar.svg",
    },
    upvotes: 129,
    views: 1883,
    answers: 3,
    createdAt: new Date(),
  },
];

const Home = () => {
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
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionsCard key={question._id} {...question} />
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
    </>
  );
};

export default Home;
