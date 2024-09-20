import QuestionForm from "@/components/forms/QuestionForm";
import { getQuestionById } from "@/lib/actions/questions.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();
  if (!userId) return null;
  const { question } = await getQuestionById({ questionId: params.id });
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 mb-6">Edit Quesiton</h1>
      <div>
        <QuestionForm
          mongoUser={JSON.stringify(question.author._id)}
          questionId={JSON.stringify(question._id)}
          defaultValues={JSON.stringify({
            title: question.title,
            explanation: question.explanation,
            tags: question.tags,
          })}
          type="edit"
        />
      </div>
    </div>
  );
};

export default page;
