import { getUserAnswers } from "@/lib/actions/user.action";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

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
            upvotes={answer.upvotes.length}
            author={answer.author}
            createdAt={answer.createdAt}
            clerkId={clerkId}
            question={answer.question}
            answer={answer.answer}
          />
        ))
      ) : (
        <p className="body-medium  text-dark500_light700 ">No answer found</p>
      )}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={isNextAnswer}
        />
      </div>
    </>
  );
};

export default AnswerTab;
