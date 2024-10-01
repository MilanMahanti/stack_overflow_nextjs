"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ScrollToAnswer = () => {
  const path = usePathname();

  useEffect(() => {
    let timeoutId: any;

    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1); // Remove the '#' from the hash
        const answerElement = document.getElementById(id);
        if (answerElement) {
          answerElement.scrollIntoView({ behavior: "smooth" });

          answerElement.classList.add("highlight");

          timeoutId = setTimeout(() => {
            answerElement.classList.remove("highlight");
          }, 2000);
        }
      }
    };

    // Scroll on initial mount and when path changes
    handleHashScroll();

    window.addEventListener("hashchange", handleHashScroll);

    return () => {
      window.removeEventListener("hashchange", handleHashScroll);
      clearTimeout(timeoutId);
    };
  }, [path]);

  return null;
};
export default ScrollToAnswer;
