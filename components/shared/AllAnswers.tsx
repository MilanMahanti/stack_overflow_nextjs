import { getAllAnswers } from "@/lib/actions/answer.action";
import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

interface params {
  questionId: string;
  totalAnswers: number;
  userId: string;
  page?: number;
  filter?: string;
}
const AllAnswers = async ({
  questionId,
  totalAnswers,
  userId,
  page,
  filter,
}: params) => {
  const allAnswers = await getAllAnswers({
    questionId: JSON.parse(questionId),
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {allAnswers.answers.map((answer: any) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="flex  items-center justify-between">
              <div className="mb-8 flex flex-col-reverse justify-between sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.profilePhoto}
                    alt={answer.author.name}
                    width={18}
                    height={18}
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700 capitalize">
                      {answer.author.name}
                    </p>
                    <p className="text-light400_light500 small-regular">
                      <span className="max-sm:hidden">&bull; </span> answered{" "}
                      {getTimeStamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Votes
                    type="answer"
                    upVotes={answer.upvotes.length}
                    downVotes={answer.downvotes.length}
                    userId={userId}
                    productId={JSON.stringify(answer._id)}
                    hasupVoted={answer.upvotes.includes(JSON.parse(userId))}
                    hasdownVoted={answer.downvotes.includes(JSON.parse(userId))}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.answer} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
