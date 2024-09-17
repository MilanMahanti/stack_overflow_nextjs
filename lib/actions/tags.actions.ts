"use server";

import Tag from "@/database/tag.model";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import { dbConnect } from "../mongoose";
import User from "@/database/user.model";

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
    const tags = await Tag.find({}).sort({ createdAt: -1 });
    return { tags };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getTopTags(params: GetTopInteractedTagsParams) {
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
