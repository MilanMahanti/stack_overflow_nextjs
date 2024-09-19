"use server";

import Question from "@/database/question.model";
import { dbConnect } from "../mongoose";
import { revalidatePath } from "next/cache";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
// import Answer from "@/database/answer.model";

export async function createQuestion(params: CreateQuestionParams) {
  try {
    dbConnect();
    const { title, explanation, author, tags, path } = params;
    const newQuestion = await Question.create({
      title,
      explanation,
      author,
    });
    const tagDocumentIds = [];
    for (const tag of tags) {
      const tagDocument = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        {
          $setOnInsert: { name: tag },
          $addToSet: { questions: newQuestion._id },
        },
        {
          upsert: true,
          new: true,
        }
      );
      tagDocumentIds.push(tagDocument._id);
    }
    await Question.findByIdAndUpdate(newQuestion._id, {
      $push: { tags: { $each: tagDocumentIds } },
    });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllQuestions(params: GetQuestionsParams) {
  try {
    dbConnect();
    const allQuestions = await Question.find()
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });
    return allQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    dbConnect();
    const question = await Question.findById(params.questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name profilePhoto",
      });
    if (!question) throw new Error("Question not found");
    return { question };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    dbConnect();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) throw new Error("Question not found");
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    dbConnect();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) throw new Error("Question not found");
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
