"use server";

import Tag, { ITag } from "@/database/tag.model";
import {
  FollowTagParams,
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import { dbConnect } from "../mongoose";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";

export async function getTag(params: any) {
  try {
    await dbConnect();
    const { _id } = params;
    const tag = await Tag.findById(_id);
    return tag;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAllTags(params: GetAllTagsParams) {
  try {
    await dbConnect();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }
    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { followers: -1 };
        break;
      case "recent":
        sortOptions = { createdOn: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skipAmount + pageSize;
    return { tags, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await dbConnect();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const topTags = await Interaction.aggregate([
      {
        $match: { user: userId },
      },
      {
        $unwind: "$tags", // Unwind the array of tags
      },
      {
        $group: {
          _id: "$tags", // Group by tag ID
          count: { $sum: 1 }, // Count occurrences of each tag
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagDetails",
        },
      },
      {
        $unwind: "$tagDetails",
      },
      {
        $project: {
          _id: 0,
          tagId: "$_id",
          tagName: "$tagDetails.name",
        },
      },
    ]);

    return topTags.map((tag: { tagId: string; tagName: string }) => ({
      id: tag.tagId,
      name: tag.tagName,
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getTopTags() {
  try {
    await dbConnect();
    const topTags = await Tag.aggregate([
      {
        $project: { name: 1, numOfQuestions: { $size: "$questions" } },
      },
      {
        $sort: { numOfQuestions: -1 },
      },
      {
        $limit: 5,
      },
    ]);
    return topTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await dbConnect();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        {
          path: "author",
          model: User,
          select: "_id clerkId name profilePhoto",
        },
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
      ],
    });

    if (!tag) throw new Error("No tag found");
    const isNext = tag.questions.length > pageSize;
    return { tag, questions: tag.questions, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function followTag(params: FollowTagParams) {
  try {
    await dbConnect();
    const { userId, tagId, action, path } = params;
    let updateQuery = {};

    if (action === "follow") {
      updateQuery = { $push: { followers: userId } };
    } else if (action === "unfollow") {
      updateQuery = { $pull: { followers: userId } };
    }

    await Tag.findByIdAndUpdate(tagId, updateQuery);
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
