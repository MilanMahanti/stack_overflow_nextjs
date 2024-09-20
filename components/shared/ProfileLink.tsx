import Image from "next/image";
import Link from "next/link";
import React from "react";

interface params {
  imgUrl: string;
  alt: string;
  title: string;
  link?: string;
}
const ProfileLink = ({ imgUrl, alt, title, link }: params) => {
  const profile = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={20}
        height={20}
        className="object-contain"
      />
      <p
        className={`paragraph-medium ${link ? "text-accent-blue hover:underline" : "text-dark400_light700"}`}
      >
        {title}
      </p>
    </>
  );
  if (link)
    return (
      <Link href={link} target="_blank" className="flex items-center gap-2">
        {profile}
      </Link>
    );
  return <div className="flex items-center gap-2">{profile}</div>;
};

export default ProfileLink;
