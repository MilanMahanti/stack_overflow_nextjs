"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/questions.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface params {
  upVotes: number;
  downVotes: number;
  userId: string;
  type: string;
  productId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}
const Votes = ({
  upVotes,
  downVotes,
  userId,
  type,
  productId,
  hasupVoted,
  hasdownVoted,
  hasSaved,
}: params) => {
  const path = usePathname();
  const router = useRouter();

  const handelSaved = async () => {
    try {
      await toggleSaveQuestion({
        userId: JSON.parse(userId),
        questionId: JSON.parse(productId),
        path,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handelVote = async (vote: string) => {
    if (vote === "upvote" && type === "question") {
      try {
        await upvoteQuestion({
          userId: JSON.parse(userId),
          questionId: JSON.parse(productId),
          hasupVoted,
          hasdownVoted,
          path,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (vote === "downvote" && type === "question") {
      try {
        await downvoteQuestion({
          userId: JSON.parse(userId),
          questionId: JSON.parse(productId),
          hasupVoted,
          hasdownVoted,
          path,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (vote === "upvote" && type === "answer") {
      try {
        await upvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(productId),
          hasupVoted,
          hasdownVoted,
          path,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (vote === "downvote" && type === "answer") {
      try {
        await downvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(productId),
          hasupVoted,
          hasdownVoted,
          path,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(productId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [userId, productId, router, path]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={`${hasupVoted ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"}`}
            alt="upvote"
            width={18}
            height={18}
            className="invert-colors cursor-pointer"
            onClick={() => handelVote("upvote")}
          />
          <p className="text-dark400_light900 background-light700_dark400  subtle-medium flex-center size-[18px] rounded-[2px]">
            {upVotes}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Image
            src={`${hasdownVoted ? "/assets/icons/downvoted.svg" : "/assets/icons/downvote.svg"}`}
            alt="downvote"
            width={18}
            height={18}
            className="invert-colors cursor-pointer"
            onClick={() => handelVote("downvote")}
          />
          <p className="text-dark400_light900 background-light700_dark400  subtle-medium flex size-[18px] items-center justify-center rounded-[2px] ">
            - {downVotes}
          </p>
        </div>
        {type === "question" && (
          <Image
            src={`${hasSaved ? "/assets/icons/star-filled.svg" : "/assets/icons/star-red.svg"}`}
            alt="star"
            width={18}
            height={18}
            className="invert-colors cursor-pointer"
            onClick={() => handelSaved()}
          />
        )}
      </div>
    </div>
  );
};

export default Votes;
