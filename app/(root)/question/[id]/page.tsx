import AnswerForm from "@/components/forms/AnswerForm";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/questions.action";
import { getUser } from "@/lib/actions/user.action";
import { formatToK, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  const { question } = await getQuestionById({ questionId: params.id });
  const { userId: clerkId } = auth();
  let mongoUser;
  if (clerkId) {
    const { user } = await getUser({ userId: clerkId });
    mongoUser = user;
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-2"
          >
            <Image
              src={question.author.profilePhoto}
              alt={question.author.name}
              width={22}
              height={22}
              className="rounded-full object-contain"
            />
            <p className="paragraph-semibold text-dark300_light700 capitalize">
              {question.author.name}
            </p>
          </Link>
          {/* // todo: implement voting */}
          <div className="flex justify-end">
            <Votes
              upVotes={question.upvotes.length}
              downVotes={question.downvotes.length}
              userId={JSON.stringify(mongoUser?._id)}
              type="question"
              productId={JSON.stringify(question._id)}
              hasupVoted={question.upvotes.includes(mongoUser?._id)}
              hasdownVoted={question.downvotes.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock"
          value={getTimeStamp(question.createdAt)}
          title=" Asked"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatToK(question.answers.length)}
          title=" Answers"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatToK(question.views)}
          title=" Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={question.explanation} />
      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag: any) => (
          <RenderTag _id={tag._id} name={tag.name} key={tag._id} />
        ))}
      </div>
      <AllAnswers
        questionId={JSON.stringify(question._id)}
        userId={JSON.stringify(mongoUser._id)}
        totalAnswers={question.answers.length}
      />
      <AnswerForm
        authorId={JSON.stringify(mongoUser._id)}
        questionId={JSON.stringify(question._id)}
      />
    </>
  );
};

export default Page;
