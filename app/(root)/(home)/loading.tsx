import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import React from "react";

const Loading = () => {
  return (
    <section>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mb-8 mt-11 flex flex-wrap gap-5">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-28 md:hidden" />
      </div>
      <div className="mb-8 hidden flex-wrap gap-3 md:flex">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <div className="flex flex-wrap gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item) => (
          <Skeleton key={item} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    </section>
  );
};

export default Loading;
