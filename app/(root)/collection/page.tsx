import SavedAnswers from "@/components/shared/SavedAnswers";
import SavedQuestions from "@/components/shared/SavedQuestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Dev Overflow | Collection",
  description:
    "View all the programming questions and answers you've saved on Dev Overflow. Revisit important discussions and follow up on the answers and updates from the community.",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 mb-6">Saved Collection</h1>

      <div className="mt-10">
        <Tabs defaultValue="saved-questions">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="saved-questions" className="tab">
              Saved Questions
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Saved Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="saved-questions" className="flex flex-col gap-4">
            <SavedQuestions searchParams={searchParams} userId={userId} />
          </TabsContent>
          <TabsContent value="answers" className="flex flex-col gap-4">
            <SavedAnswers searchParams={searchParams} userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
