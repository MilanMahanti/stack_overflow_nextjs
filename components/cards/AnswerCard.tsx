import React from "react";
import Metric from "../shared/Metric";
import { formatToK, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";
interface props {
  _id?: string;
  questionId: string;
  clerkId?: string;
  title: string;
  upvotes: number;
  author: {
    clerkId: string;
    name: string;
    profilePhoto: string;
  };
  createdAt: Date;
}
const AnswerCard = ({
  _id,
  questionId,
  title,
  upvotes,
  author,
  createdAt,
  clerkId,
}: props) => {
  const showActionBtn = clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] px-10 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {title}
          </h3>
        </div>

        <SignedIn>
          {showActionBtn && (
            <EditDeleteAction type="Answer" productId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
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
  );
};

export default AnswerCard;