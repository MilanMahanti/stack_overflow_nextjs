import { UserButton } from "@clerk/nextjs";
import React from "react";

const Home = () => {
  return (
    <div>
      <header>
        <UserButton />
      </header>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
