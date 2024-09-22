"use server";

import User from "@/database/user.model";
import { dbConnect } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";

export async function getUser(params: GetUserByIdParams) {
  try {
    dbConnect();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });
    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getAllUser(params: GetAllUsersParams) {
  try {
    dbConnect();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case "old_users":
        sortOptions = { joiningDate: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      case "new_users":
        sortOptions = { joiningDate: -1 };
        break;

      default:
        break;
    }
    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + pageSize;
    return { users, isNext };
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
    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    let sortOptions = {};
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }
    // Fetch pageSize + 1 items to check if there's a next page
    const savedQuestionsData = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: {
        path: "tags",
        model: Tag,
        select: "_id name",
      },
    });

    const savedQuestions = savedQuestionsData.saved.slice(0, pageSize);
    const isNext = savedQuestionsData.saved.length > pageSize;
    return { savedQuestions, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    dbConnect();
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .skip(skipAmount)
      .limit(pageSize)
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
    const isNextQuestion = totalQuestions > questions.length + skipAmount;
    return { isNextQuestion, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    dbConnect();
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "question",
        model: Question,
        select: "_id title",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name profilePhoto",
      });
    const isNextAnswer = totalAnswers > answers.length + skipAmount;
    return { isNextAnswer, answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
