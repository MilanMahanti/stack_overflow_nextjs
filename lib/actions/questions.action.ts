"use server";

import Question from "@/database/question.model";
import { dbConnect } from "../mongoose";
import { revalidatePath } from "next/cache";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";
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

export async function editQuestion(params: EditQuestionParams) {
  try {
    dbConnect();
    const { questionId, title, explanation, path } = params;
    const prevQuestion = await Question.findById(questionId);
    if (!prevQuestion) throw new Error("Question not found");
    prevQuestion.title = title;
    prevQuestion.explanation = explanation;
    await prevQuestion.save();
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    // Connect to the database
    await dbConnect();

    const { questionId, path } = params;

    // Find the question by its ID
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    // Remove the question reference from all tags associated with the question
    await Tag.updateMany(
      { question: questionId },
      { $pull: { questions: questionId } }
    );

    // Delete all associated answers
    await Answer.deleteMany({ question: questionId });
    // Delete all interaction
    await Interaction.deleteMany({ question: questionId });
    // Delete the question
    await Question.findByIdAndDelete(questionId);

    // Optionally revalidate the path (for cache invalidation)
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllQuestions(params: GetQuestionsParams) {
  try {
    dbConnect();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { explanation: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }
    const allQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + allQuestions.length;
    return { questions: allQuestions, isNext };
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

export async function getTopQuestions() {
  try {
    dbConnect();
    const topQuestions = await Question.find()
      .sort({ views: -1, upvotes: -1 })
      .limit(5);
    return topQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
