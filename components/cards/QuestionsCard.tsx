import React from "react";
import RenderTag from "../shared/RenderTag";
import Link from "next/link";
import Metric from "../shared/Metric";
import { formatToK, getTimeStamp } from "@/lib/utils";
interface props {
  _id: string;
  title: string;
  tags: {
    _id: string;
    value: string;
  }[];
  views: number;
  upvotes: number;
  answers: number;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  createdAt: Date;
}
const QuestionsCard = ({
  _id,
  title,
  tags,
  views,
  upvotes,
  answers,
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
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2 ">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.value} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          isAuthor
          href={`/profile/${author._id}`}
          value={author.name}
          title={getTimeStamp(createdAt)}
          textStyle="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={formatToK(upvotes)}
          title="Votes"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatToK(answers)}
          title="Answers"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatToK(views)}
          title="Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionsCard;