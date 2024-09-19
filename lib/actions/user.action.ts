"use server";

import User from "@/database/user.model";
import { dbConnect } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";

export async function getUser(params: GetUserByIdParams) {
  try {
    dbConnect();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getAllUser() {
  try {
    dbConnect();
    const users = await User.find().sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createUser(userdata: CreateUserParams) {
  try {
    dbConnect();
    console.log("Creating user with data:", userdata.clerkId);
    const user = await User.create(userdata);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateUser(userdata: UpdateUserParams) {
  try {
    dbConnect();
    const { clerkId, updateData, path } = userdata;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    dbConnect();
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // get all questionids created by the user
    await Question.find({ author: user._id });

    // delete all questions created by the user
    await Question.deleteMany({ author: user._id });

    // todo:delete all answers and comments created by user

    // delete user
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    dbConnect();
    const { questionId, userId, path } = params;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Check if the question is already saved by the user
    const hasSaved = user.saved.includes(questionId);
    let updateQuery = {};
    if (hasSaved) {
      updateQuery = { $pull: { saved: questionId } };
    } else {
      updateQuery = { $addToSet: { saved: questionId } };
    }
    await User.findByIdAndUpdate(userId, updateQuery, { new: true });

    revalidatePath(path);
  } catch (error) {
    // Log and throw the error for further handling
    console.error(error);
    throw error;
  }
}

export async function getSavedQuestion(params: GetSavedQuestionsParams) {
  try {
    dbConnect();
    const { clerkId } = params;
    const savedQuestion = await User.findOne({ clerkId }).populate({
      path: "saved",
      options: {
        sort: { createdAt: -1 },
      },
      populate: {
        path: "tags",
        model: Tag,
        select: "_id name",
      },
    });

    return savedQuestion;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
