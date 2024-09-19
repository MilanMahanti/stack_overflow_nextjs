import React from "react";

import Link from "next/link";
import { Badge } from "../ui/badge";

interface props {
  _id: string;
  name: string;
  followers: [];
  questions: [];
}
const TagsCard = async ({ _id, name, followers, questions }: props) => {
  return (
    <Link
      href={`/tag/${_id}`}
      className="shadow-md dark:shadow-none max-xs:min-w-full xs:w-[260px]"
    >
      <div className="background-light900_dark200 light-border flex flex-col items-start justify-between gap-6 rounded-xl border  px-8 py-10">
        <Badge className="paragraph-semibold background-light800_dark300 text-dark300_light900 rounded-md border-none px-5 py-1.5 ">
          {name}
        </Badge>
        <p className="small-regular text-dark500_light700">
          JavaScript, often abbreviated as JS, is a programming language that is
          one of the core technologies of the World Wide Web, alongside HTML and
          CSS
        </p>
        <div className="body-semibold flex gap-3">
          <p className="primary-text-gradient">{questions.length}+</p>
          <p className="text-dark500_light700">Questions</p>
        </div>
      </div>
    </Link>
  );
};

export default TagsCard;
