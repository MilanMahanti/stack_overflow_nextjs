"use client";

import { Button } from "../ui/button"; // Assuming you have a Button component or use native button
import { useState } from "react";

const GenerateAiButton = ({ generateAiAnswer, isAiSubmmitting }: any) => {
  const [active, setActive] = useState(false);

  return (
    <Button
      className={`relative flex items-center gap-1.5 rounded-full px-4 py-2.5 
        text-primary-500 shadow-none transition-transform duration-300 dark:text-primary-500 ${
          active ? "scale-110" : "scale-100"
        }`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={generateAiAnswer}
      disabled={isAiSubmmitting}
    >
      {/* Glowing border animation */}
      <div className="dots_border"></div>

      {/* Sparkling Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="sparkle"
      >
        <path
          className="path"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="black"
          fill="black"
          d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
        ></path>
      </svg>

      {/* Text */}
      <span className="text_button">
        {isAiSubmmitting ? "Generating..." : "Generate an AI answer"}
      </span>
    </Button>
  );
};

export default GenerateAiButton;
