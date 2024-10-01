import QuestionsCard from "@/components/cards/QuestionsCard";
import FollowTag from "@/components/shared/FollowTag";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getQuestionByTagId } from "@/lib/actions/tags.action";
import { getUser } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import React from "react";
export async function generateMetadata({
  params,
}: URLProps): Promise<Metadata> {
  const { tag } = await getQuestionByTagId({
    tagId: params.id,
  });
  return {
    title: `DevFlow | ${tag.name} Tag`,
    description: `Explore all questions and discussions related to ${tag.name} on DevFlow. Stay updated with the latest trends, challenges, and solutions in the ${tag.name} community.`,
  };
}

const Page = async ({ params, searchParams }: URLProps) => {
  const { tag, questions, isNext } = await getQuestionByTagId({
    tagId: params.id,
    searchQuery: searchParams?.q,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  const { userId: clerkId } = auth();
  let mongoUser;
  if (clerkId) {
    const { user } = await getUser({ userId: clerkId });
    mongoUser = user;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="h1-bold text-dark100_light900 capitalize">{tag.name}</h1>
        <FollowTag
          tagId={JSON.stringify(tag?._id)}
          isFollowing={tag?.followers.includes(mongoUser?._id)}
          userId={JSON.stringify(mongoUser?._id)}
          tagName={tag.name}
        />
      </div>
      <div className="mt-11 w-full">
        <LocalSearchBar
          route={`/tag/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          extraClasses="flex-1"
          placeholder="Search questions here..."
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question: any) => (
            <QuestionsCard
              key={question._id}
              _id={question._id}
              answers={question.answers.length}
              title={question.title}
              author={question.author}
              views={question.views}
              upvotes={question.upvotes.length}
              createdAt={question.createdAt}
              tags={question.tags}
            />
          ))
        ) : (
          <NoResult
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
    discussion. our query could be the next big thing others learn from. Get
    involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
};

export default Page;
