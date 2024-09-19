"use server";

import Answer from "@/database/answer.model";
import { dbConnect } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    dbConnect();
    const { question, author, answer, path } = params;
    const newAnswer = await Answer.create({
      question,
      author,
      answer,
    });
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    // todo: add interactions
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllAnswers(params: GetAnswersParams) {
  try {
    dbConnect();
    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name profilePhoto",
      })
      .sort({
        createdAt: -1,
      });
    return { answers };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    dbConnect();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) throw new Error("Answer not found");
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    dbConnect();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) throw new Error("Answer not found");
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
