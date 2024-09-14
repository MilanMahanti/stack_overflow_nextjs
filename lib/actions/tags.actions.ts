"use server";

import Tag from "@/database/tag.model";

export async function getTag(params: any) {
  try {
    const { _id } = params;
    const tag = await Tag.findById(_id);
    return tag;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
