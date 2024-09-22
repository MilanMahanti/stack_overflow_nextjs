"use server";

import Tag, { ITag } from "@/database/tag.model";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import { dbConnect } from "../mongoose";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTag(params: any) {
  try {
    dbConnect();
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
    dbConnect();
    const { searchQuery, filter } = params;
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

    const tags = await Tag.find(query).sort(sortOptions);
    return { tags };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    dbConnect();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // todo: make interections collection in db to fetch actual top interactions

    return ["Next.js", "HTML", "CSS"];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getTopTags() {
  try {
    dbConnect();
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
    dbConnect();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
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
    return { tagName: tag.name, questions: tag.questions };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
