import QuestionsCard from "@/components/cards/QuestionsCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestion, getUser } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const { user } = await getUser({ userId });
  if (!user) redirect("/sign-in");

  const savedQuestions = await getSavedQuestion({ clerkId: userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 mb-6">Saved Questions</h1>
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
          containerClasses="hidden max-md:flex"
        />
      </div>
      <div className="mt-10 flex flex-col gap-6">
        {savedQuestions.saved.length > 0 ? (
          savedQuestions.saved.map((question: any) => (
            <QuestionsCard
              key={question._id}
              _id={question._id}
              answers={question.answers.length}
              title={question.title}
              author={user}
              views={question.views}
              upvotes={question.upvotes.length}
              createdAt={question.createdAt}
              tags={question.tags}
            />
          ))
        ) : (
          <NoResult
            title="There’s no saved question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/"
            linkText="Go back to Home"
          />
        )}
      </div>
    </>
  );
};

export default Page;