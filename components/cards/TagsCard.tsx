import React from "react";

import Link from "next/link";
import { Badge } from "../ui/badge";

interface props {
  _id: string;
  name: string;
  followers: [];
  questions: [];
  description: string;
}
const TagsCard = async ({
  _id,
  name,
  followers,
  questions,
  description,
}: props) => {
  return (
    <Link
      href={`/tag/${_id}`}
      className="light-border background-light900_dark200 flex flex-col items-start justify-between gap-6 rounded-xl  border px-8 py-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-105  dark:border-none  dark:shadow-none max-xs:min-w-full xs:w-[260px]"
    >
      <Badge className="paragraph-semibold background-light800_dark300 text-dark300_light900 rounded-md border-none px-5 py-1.5 ">
        {name}
      </Badge>

      <p className="small-regular text-dark500_light700 ">
        {description.slice(0, 200)}...
      </p>
      <div className="body-semibold flex gap-3">
        <p className="primary-text-gradient">{questions.length}+</p>
        <p className="text-dark500_light700">Questions</p>
      </div>
    </Link>
  );
};

export default TagsCard;
