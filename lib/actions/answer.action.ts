"use server";

import Answer from "@/database/answer.model";
import { dbConnect } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

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

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    dbConnect();
    const { answerId, path } = params;

    // Find the answer to delete
    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error("Answer not found");

    // Find the question that the answer belongs to
    const question = await Question.findById(answer.question);
    if (!question) throw new Error("Question not found");

    // Remove the answer from the question's answers array
    await question.updateOne({ $pull: { answers: answer._id } });

    // Remove the interaction
    await Interaction.deleteOne({ answer: answerId });

    // Delete the answer from the database
    await Answer.findByIdAndDelete(answerId);

    // Revalidate the path after deletion
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllAnswers(params: GetAnswersParams) {
  try {
    dbConnect();
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    let sortOptions = {};
    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }
    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name profilePhoto",
      })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNext = skipAmount + pageSize < totalAnswers;
    return { answers, isNext };
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
