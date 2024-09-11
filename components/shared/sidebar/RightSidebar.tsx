import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";

const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 custom-scrollbar light-border  sticky right-0 top-0 z-30 flex min-h-screen w-[350px] flex-col items-start overflow-y-auto p-6 pt-32  shadow-light-300 dark:shadow-none max-lg:hidden">
      <div className="mb-16 ">
        <h3 className="h3-bold text-dark200_light900 mb-6">Hot Network</h3>
        <div className="flex w-full flex-col gap-[30px]">
          <Link
            className=" flex cursor-pointer items-center justify-between gap-7"
            href="/"
          >
            <p className="body-medium  text-dark500_light700 ">
              Would it be appropriate to point out an error in another paper
              during a referee report?
            </p>
            <Image
              src="/assets/icons/chevron-right.svg"
              alt="right arrow"
              width={20}
              height={20}
              className="invert-colors"
            />
          </Link>
        </div>
      </div>
      <div className="w-full">
        <h3 className="h3-bold text-dark200_light900 mb-6">Popular Tags</h3>
        <div className="flex flex-col gap-4">
          <RenderTag _id="12" name="Nextjs" totalQuestions={1087} showCount />
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
