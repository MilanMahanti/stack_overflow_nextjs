import { getUserAnswers } from "@/lib/actions/user.action";
import React from "react";
import AnswerCard from "../cards/AnswerCard";

interface params {
  searchParams: any;
  userId: string;
  clerkId: string;
}
const AnswerTab = async ({ searchParams, userId, clerkId }: params) => {
  const { answers } = await getUserAnswers({ userId });
  return (
    <>
      {answers.map((answer) => (
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
      ))}
    </>
  );
};

export default AnswerTab;
