import QuestionForm from "@/components/forms/QuestionForm";
import { getUser } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "DevFlow | Ask a Question",
  description:
    "Submit your programming questions on DevFlow. Get real-time answers from experienced developers and collaborate to find the best solutions.",
};

const AskQuestion = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const { user } = await getUser({ userId });
  if (!user) redirect("/sign-in");
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 mb-6">
        Ask a public quesiton
      </h1>
      <div>
        <QuestionForm mongoUser={JSON.stringify(user._id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
