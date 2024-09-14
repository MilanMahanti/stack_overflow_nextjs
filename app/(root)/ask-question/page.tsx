import QuestionForm from "@/components/forms/QuestionForm";
import { getUser } from "@/lib/actions/user.action";
// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async () => {
  // const { userId } = auth();
  const userId = "CLERK123456";
  const user = await getUser({ userId });
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
