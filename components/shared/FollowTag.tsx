"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { followTag } from "@/lib/actions/tags.action";
import toast from "react-hot-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
interface FollowTagProps {
  userId: string;
  tagId: string;
  isFollowing: boolean;
  tagName: string;
}
const FollowTag = ({ tagName, userId, tagId, isFollowing }: FollowTagProps) => {
  const [follow, setFollow] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();

  const handelFollow = async () => {
    try {
      setIsLoading(true);
      await followTag({
        userId: JSON.parse(userId),
        tagId: JSON.parse(tagId),
        path,
        action: follow ? "unfollow" : "follow",
      });
      setFollow(!follow);
      setIsLoading(false);
      toast.success(
        `Successfully ${follow ? "unfollowed" : "followed"} ${tagName}`
      );
    } catch (error) {
      toast.error("Something went wrong try again later");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={() => handelFollow()}
      className={`${follow ? "text-dark300_light700 border-2 border-primary-500 bg-transparent  hover:bg-inherit hover:text-primary-500" : "primary-gradient btn text-light-800"} h2-bold `}
    >
      {isLoading ? (
        <>
          <ReloadIcon className="text-dark300_light700 mr-2 size-4 animate-spin" />
          {follow ? "Unfollowing" : "Following"}
        </>
      ) : (
        <>{follow ? "Unfollow" : "Follow"}</>
      )}
    </Button>
  );
};

export default FollowTag;
