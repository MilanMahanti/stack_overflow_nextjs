import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";
import { getTopQuestions } from "@/lib/actions/questions.action";
import { getTopTags } from "@/lib/actions/tags.action";

const RightSidebar = async () => {
  const topQuestions = await getTopQuestions();
  const topTags = await getTopTags();
  return (
    <section className="background-light900_dark200 custom-scrollbar light-border  sticky right-0 top-0 z-30 flex h-screen w-[350px] shrink-0 flex-col items-start overflow-y-auto p-6  pt-32 shadow-light-300 dark:shadow-none max-lg:hidden">
      <div className="mb-16 ">
        <h3 className="h3-bold text-dark200_light900 mb-6">Hot Network</h3>
        <div className="flex w-full flex-col gap-[30px]">
          {topQuestions.length > 0 ? (
            topQuestions.map((question) => (
              <div key={question._id}>
                <Link
                  className="group flex cursor-pointer items-center justify-between gap-7" // Added "group" class to apply hover styles
                  href={`/question/${question._id}`}
                >
                  <p className="body-medium text-dark500_light700">
                    {question.title}
                  </p>
                  <Image
                    src="/assets/icons/chevron-right.svg"
                    alt="right arrow"
                    width={20}
                    height={20}
                    className="invert-colors transition-transform duration-300 group-hover:translate-x-2" // Animating image with hover effect
                  />
                </Link>
              </div>
            ))
          ) : (
            <p className="body-medium  text-dark500_light700 ">
              No Hot Questions to show
            </p>
          )}
        </div>
      </div>
      <div className="w-full">
        <h3 className="h3-bold text-dark200_light900 mb-6">Popular Tags</h3>
        <div className="flex flex-col gap-4">
          {topTags.length > 0 ? (
            topTags.map((tag) => (
              <RenderTag
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                totalQuestions={tag.numOfQuestions}
                showCount
              />
            ))
          ) : (
            <p className="body-medium  text-dark500_light700 ">
              No Tags to show
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
