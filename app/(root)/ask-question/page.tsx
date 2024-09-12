import QuestionForm from "@/components/forms/QuestionForm";
import React from "react";

const AskQuestion = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 mb-6">
        Ask a public quesiton
      </h1>
      <div>
        <QuestionForm />
      </div>
    </div>
  );
};

export default AskQuestion;
