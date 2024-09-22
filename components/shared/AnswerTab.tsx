import { getUserAnswers } from "@/lib/actions/user.action";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import Paginaion from "./Paginaion";

interface params {
  searchParams: any;
  userId: string;
  clerkId: string;
}
const AnswerTab = async ({ searchParams, userId, clerkId }: params) => {
  const { answers, isNextAnswer } = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {answers.length > 0 ? (
        answers.map((answer) => (
          <AnswerCard
            key={answer._id}
            _id={answer._id}
            questionId={answer.question._id}
            title={answer.question.title}
            upvotes={answer.upvotes.length}
            author={answer.author}
            createdAt={answer.createdAt}
            clerkId={clerkId}
          />
        ))
      ) : (
        <p className="body-medium  text-dark500_light700 ">No answer found</p>
      )}
      <div className="mt-10">
        <Paginaion
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={isNextAnswer}
        />
      </div>
    </>
  );
};

export default AnswerTab;
