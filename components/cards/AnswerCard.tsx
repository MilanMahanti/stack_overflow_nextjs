import React from "react";
import Metric from "../shared/Metric";
import { formatToK, getTimeStamp } from "@/lib/utils";
import Link from "next/link";
interface props {
  questionId: string;
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
  questionId,
  title,
  upvotes,
  author,
  createdAt,
}: props) => {
  return (
    <div className="card-wrapper light-border w-full rounded-[10px] border px-9 py-8  dark:border-none sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${questionId}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
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
