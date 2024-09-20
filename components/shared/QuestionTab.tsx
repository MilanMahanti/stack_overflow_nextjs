import { getUserQuestions } from "@/lib/actions/user.action";
import React from "react";
import QuestionsCard from "../cards/QuestionsCard";
interface params {
  searchParams: any;
  userId: string;
  clerkId: string;
}
const QuestionTab = async ({ searchParams, userId, clerkId }: params) => {
  const { totalQuestion, questions } = await getUserQuestions({ userId });
  return (
    <>
      {questions.map((question) => (
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
      ))}
    </>
  );
};

export default QuestionTab;
