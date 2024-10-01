import { getUserQuestions } from "@/lib/actions/user.action";
import React from "react";
import QuestionsCard from "../cards/QuestionsCard";
import Pagination from "./Pagination";
interface params {
  searchParams: any;
  userId: string;
  clerkId: string;
}
const QuestionTab = async ({ searchParams, userId, clerkId }: params) => {
  const { questions, isNextQuestion } = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionsCard
            clerkId={clerkId}
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
        <p className="body-medium  text-dark500_light700 ">No question found</p>
      )}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={isNextQuestion}
        />
      </div>
    </>
  );
};

export default QuestionTab;
