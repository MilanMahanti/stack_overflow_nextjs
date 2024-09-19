import { getUser } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const user = await getUser({ userId });
  if (!user) redirect("/sign-in");
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 mb-6">Saved Questions</h1>
    </div>
  );
};

export default Page;
