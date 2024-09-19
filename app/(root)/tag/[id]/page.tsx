import QuestionsCard from "@/components/cards/QuestionsCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getQuestionByTagId } from "@/lib/actions/tags.action";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  const { tagName, questions } = await getQuestionByTagId({ tagId: params.id });
  console.log(questions);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 capitalize">{tagName}</h1>

      <div className="mt-11 w-full">
        <LocalSearchBar
          route={`/tag/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          extraClasses="flex-1"
          placeholder="Search questions here..."
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question: any) => (
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
    </>
  );
};

export default Page;
