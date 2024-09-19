"use client";

import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { SignedIn, SignedOut, SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
  const pathName = usePathname();
  const { userId } = useAuth();
  return (
    <aside className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 z-30 flex h-screen w-fit flex-col items-center justify-between overflow-y-auto border-r p-6 pt-32 shadow-light-300 dark:shadow-none max-sm:hidden lg:min-w-[266px]">
      <div className="flex w-full flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            pathName.includes(item.route) &&
            (item.route.length > 1 || item.route === pathName);

          if (item.route === "/profile") {
            if (userId) {
              item.route = `/profile/${userId}`;
            }
          }
          return (
            <div key={item.route}>
              <Link
                href={item.route}
                className={`${isActive ? "primary-gradient rounded-[8px] text-light-900" : "text-dark300_light900"} flex items-center justify-start gap-5 bg-transparent p-4 `}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive ? "" : "invert-colors"}`}
                />
                <p
                  className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}
                >
                  {item.label}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="mt-4 w-full">
        <SignedIn>
          <SignOutButton>
            <Button className="text-dark400_light900  flex items-center justify-start gap-3 border-none bg-transparent hover:bg-transparent">
              <Image
                src="/assets/icons/tag.svg"
                alt="logout"
                width={20}
                height={20}
                className="invert-colors"
              />
              <span className="max-lg:hidden"> Logout </span>
            </Button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <div className="flex  flex-col gap-3">
            <Link href="/sign-in">
              <Button className="small-medium btn-secondary min-h-[42px] w-full rounded-lg px-4 py-3 shadow-none">
                <span className="primary-text-gradient max-lg:hidden">
                  Login
                </span>
                <Image
                  src="/assets/icons/account.svg"
                  alt="signup"
                  height={20}
                  width={20}
                  className="invert-colors lg:hidden"
                />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="small-medium light-border-2 text-dark400_light800 min-h-[42px] w-full rounded-lg bg-light-700 px-4 py-3 shadow-none  dark:bg-dark-300">
                <span className="max-lg:hidden">Sign up</span>
                <Image
                  src="/assets/icons/sign-up.svg"
                  alt="signup"
                  height={20}
                  width={20}
                  className="invert-colors lg:hidden"
                />
              </Button>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  );
};

export default LeftSidebar;
