"use server";

import Question from "@/database/question.model";
import { dbConnect } from "../mongoose";
import { revalidatePath } from "next/cache";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

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
