import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface props {
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const NoResult = ({ title, description, link, linkText }: props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center gap-4">
      <Image
        src="/assets/images/light-illustration.png"
        alt="not found"
        width={270}
        height={200}
        className="object-contain   dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="not found"
        width={270}
        height={200}
        className="hidden object-contain  dark:flex"
      />
      <h2 className="h2-bold text-dark200_light900 mt-9">{title}</h2>
      <p className="body-regular text-dark500_light700 max-w-md text-center">
        {description}
      </p>
      <Link href={link} className="flex">
        <Button className="primary-gradient min-h-[42px] px-4 py-3 !text-light-900 hover:!text-light-800">
          {linkText}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
