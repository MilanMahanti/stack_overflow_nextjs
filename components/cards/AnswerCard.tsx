import React from "react";
import Metric from "../shared/Metric";
import { extractTextFromHTML, formatToK, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
interface props {
  _id?: string;
  clerkId?: string;
  question: any;
  upvotes: number;
  author: {
    clerkId: string;
    name: string;
    profilePhoto: string;
  };
  createdAt: Date;
  answer: string;
}
const AnswerCard = ({
  _id,
  question,
  upvotes,
  author,
  createdAt,
  clerkId,
  answer,
}: props) => {
  const showActionBtn = clerkId === author.clerkId;

  return (
    <div className="card-wrapper light-border w-full rounded-[10px] border px-9 py-8  dark:border-none sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(question.createdAt)}
          </span>
          <Link href={`/question/${question._id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionBtn && (
            <EditDeleteAction type="answer" productId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2 ">
        {question.tags?.map((tag: any) => {
          return <RenderTag key={tag._id} _id={tag._id} name={tag.name} />;
        })}
      </div>
      <div className="flex-between mb-4 mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={question?.author.profilePhoto}
          alt={question?.author.name}
          isAuthor
          href={`/profile/${question?.author.clerkId}`}
          value={question?.author.name}
          title={getTimeStamp(question?.createdAt)}
          textStyle="body-medium text-dark400_light700 capitalize"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={formatToK(question?.upvotes.length)}
          title="Votes"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatToK(question?.answers.length)}
          title="Answers"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatToK(question?.views)}
          title="Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
      <div className="ml-8 rounded-sm border-l-4 border-light-700 p-4">
        <p className="paragraph-regular text-dark200_light800">
          {extractTextFromHTML(answer)}...
        </p>
        <div className="flex-between mt-6 w-full flex-wrap gap-3">
          <Link
            href={`/question/${question._id}#${_id}`}
            className="small-medium text-accent-blue hover:underline"
          >
            View Answer
          </Link>
          <div className="flex flex-wrap items-start gap-3">
            <Metric
              imgUrl={author.profilePhoto}
              alt={author.name}
              isAuthor
              value={author.name}
              title={getTimeStamp(createdAt)}
              textStyle="body-medium text-dark400_light700 capitalize"
            />

            <Metric
              imgUrl="/assets/icons/like.svg"
              alt="upvotes"
              value={formatToK(upvotes)}
              title="Votes"
              textStyle="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
