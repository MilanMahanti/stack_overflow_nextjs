import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/actions/user.action";
import { formatJoinDate } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";
interface URLProps {
  params: { id: string };
  searchParams: any;
}
const Page = async ({ params, searchParams }: URLProps) => {
  const { user, totalAnswers, totalQuestions } = await getUser({
    userId: params.id,
  });
  const { userId: clerkId } = auth();
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Image
            src={user?.profilePhoto}
            alt={user?.name}
            width={140}
            height={140}
            className="size-[140px] shrink-0 grow-0 rounded-full border-2 border-primary-500 object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900 capitalize">
              {user?.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800 mb-4">
              @{user?.username}
            </p>
            <div className="mb-4 flex flex-wrap items-center justify-start gap-5">
              {user?.portfolio && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  alt="link"
                  title="Portfolio"
                  link={user?.portfolio}
                />
              )}
              {user?.address && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  alt="location"
                  title={user?.address}
                />
              )}
              {user?.joiningDate && (
                <ProfileLink
                  imgUrl="/assets/icons/calendar.svg"
                  alt="calender"
                  title={formatJoinDate(user?.joiningDate)}
                />
              )}
            </div>
            {user?.bio && (
              <p className="paragraph-regular text-dark400_light800">
                {user?.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === user.clerkId && (
              <Link href={"/profile/edit"}>
                <Button className="paragraph-medium btn-secondary light-border text-dark300_light900  border px-4 py-3 shadow-md dark:shadow-none">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats totalAnswers={totalAnswers} totalQuestions={totalQuestions} />
      <div className="mt-10">
        <Tabs defaultValue="top-posts">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts" className="flex flex-col gap-4">
            <QuestionTab
              searchParams={searchParams}
              clerkId={clerkId!}
              userId={user._id}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTab
              searchParams={searchParams}
              clerkId={clerkId!}
              userId={user._id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
