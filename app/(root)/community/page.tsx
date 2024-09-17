import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { UserFilters } from "@/constants/filters";
import { getAllUser } from "@/lib/actions/user.action";
import React from "react";

const page = async () => {
  const { users } = await getAllUser();
  console.log(users);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          extraClasses="flex-1"
          placeholder="Search users here..."
        />
        <Filter
          filters={UserFilters}
          extraClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-wrap gap-4">
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard
              key={user.id}
              profilePhoto={user.profilePhoto}
              name={user.name}
              userName={user.username}
              _id={user._id}
              clerkId={user.clerkId}
            />
          ))
        ) : (
          <NoResult
            title="There's no user to show"
            description="Be the first one to become a part of this community"
            link="/sign-up"
            linkText="Sign Up"
          />
        )}
      </div>
    </>
  );
};

export default page;
