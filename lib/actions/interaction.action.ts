"use server";

import Question from "@/database/question.model";
import { dbConnect } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await dbConnect();
    const { questionId, userId } = params;

    // Fetch the question and increment views, also populating the tags field
    const question = await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    if (!question) {
      throw new Error(`Question with ID ${questionId} not found`);
    }

    // If user is logged in, record the interaction
    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      // If interaction already exists, log and exit
      if (existingInteraction) {
        return console.log("Interaction already exists");
      }

      // Create a new interaction with the tags associated with the question
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
        tags: question.tags,
      });
    }
  } catch (error) {
    console.error("Error in viewQuestion:", error);
    throw error;
  }
}
