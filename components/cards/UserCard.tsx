import Image from "next/image";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Link from "next/link";
import { getTopTags } from "@/lib/actions/tags.actions";
import { Badge } from "../ui/badge";

interface props {
  profilePhoto: string;
  name: string;
  userName: string;
  _id: string;
  clerkId: string;
}
const UserCard = async ({
  clerkId,
  profilePhoto,
  name,
  userName,
  _id,
}: props) => {
  const topTags = await getTopTags({ userId: _id });
  return (
    <Link
      href={`/profile/${clerkId}`}
      className="shadow-md dark:shadow-none max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex flex-col items-center justify-between gap-6 rounded-xl border  p-8">
        <Image
          width={100}
          height={100}
          src={profilePhoto}
          alt={name}
          className="rounded-full object-contain"
        />
        <div className="flex flex-col gap-3 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
          <p className="body-regular text-dark500_light500">@ {userName}</p>
        </div>
        <div className="flex gap-3">
          {/* //todo:change this as we implement the actual topTags  */}

          {topTags.length > 0 ? (
            topTags.map((tag, i) => <RenderTag key={i} _id={tag} name={tag} />)
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
