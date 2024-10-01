"use server";

import User from "@/database/user.model";
import { dbConnect } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedAnswersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  RecommendedParams,
  ToggleSaveAnswerParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";
import Interaction from "@/database/interaction.model";

export async function getUser(params: GetUserByIdParams) {
  try {
    await dbConnect();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });
    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);
    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },

      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const questionCriteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
    ];
    const badgeCounts = assignBadges({ criteria: questionCriteria });
    return { user, totalQuestions, totalAnswers, badgeCounts };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getAllUser(params: GetAllUsersParams) {
  try {
    await dbConnect();
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
    await dbConnect();
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
    await dbConnect();
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
    await dbConnect();
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Extract question IDs
    const userQuestions = await Question.find({ author: user._id });

    // get all questionids created by the user
    const questionIds = userQuestions.map((question) => question._id);

    // Batch delete answers related to those questions
    await Answer.deleteMany({ question: { $in: questionIds } });

    // delete all the answers created by the user
    await Answer.deleteMany({ author: user._id });

    // delete all questions created by the user
    await Question.deleteMany({ author: user._id });
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
    await dbConnect();
    const { questionId, userId, path } = params;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Check if the question is already saved by the user
    const hasSaved = user.savedQuestions.includes(questionId);
    let updateQuery = {};
    if (hasSaved) {
      updateQuery = { $pull: { savedQuestions: questionId } };
    } else {
      updateQuery = { $addToSet: { savedQuestions: questionId } };
    }
    await User.findByIdAndUpdate(userId, updateQuery, { new: true });

    revalidatePath(path);
  } catch (error) {
    // Log and throw the error for further handling
    console.error(error);
    throw error;
  }
}
export async function toggleSaveAnswer(params: ToggleSaveAnswerParams) {
  try {
    await dbConnect();
    const { answerId, userId, path } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Check if the question is already saved by the user
    const hasSaved = user.savedAnswers.includes(answerId);
    let updateQuery = {};
    if (hasSaved) {
      updateQuery = { $pull: { savedAnswers: answerId } };
    } else {
      updateQuery = { $addToSet: { savedAnswers: answerId } };
    }
    await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    // Log and throw the error for further handling
    console.error(error);
    throw error;
  }
}

export async function getSavedAnswer(params: GetSavedAnswersParams) {
  try {
    await dbConnect();
    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Answer> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    let sortOptions = {};
    switch (filter) {
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
    const savedAnswerData = await User.findOne({ clerkId }).populate({
      path: "savedAnswers",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        {
          path: "question",
          populate: [
            {
              path: "tags",
              select: "_id name",
            },
            {
              path: "author",
              select: "_id clerkId name profilePhoto",
            },
          ],
        },
        {
          path: "author",
          select: "_id clerkId name profilePhoto",
        },
      ],
    });
    const savedAnswers = savedAnswerData?.savedAnswers.slice(0, pageSize);
    const isNext = savedAnswerData?.savedAnswers.length > pageSize;
    return { savedAnswers, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSavedQuestion(params: GetSavedQuestionsParams) {
  try {
    await dbConnect();
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
      path: "savedQuestions",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        {
          path: "author",
          select: "_id clerkId name profilePhoto",
        },
      ],
    });

    const savedQuestions = savedQuestionsData.savedQuestions.slice(0, pageSize);
    const isNext = savedQuestionsData.savedQuestions.length > pageSize;
    return { savedQuestions, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await dbConnect();
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .sort({
        createdAt: -1,
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
    await dbConnect();
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .sort({
        createdAt: -1,
        views: -1,
        upvotes: -1,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "question",
        model: Question,
        populate: [
          {
            path: "tags",
            model: Tag,
            select: "_id name",
          },
          {
            path: "author",
            model: User,
            select: "_id clerkId name profilePhoto",
          },
        ],
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

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await dbConnect();

    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    // find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();
    const userFollowedTags = await Tag.find({ followers: user._id }).select(
      "_id"
    );
    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    const allTags = [...userTags, ...userFollowedTags];
    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(allTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
  }
}
