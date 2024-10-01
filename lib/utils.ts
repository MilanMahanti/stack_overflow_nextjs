import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";
import * as cheerio from "cheerio";

/**
 * Merges Tailwind CSS class names, resolving conflicts.
 *
 * @param {...ClassValue} inputs - Class names to be merged.
 * @returns {string} - Merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the time difference between a provided date and the current time.
 *
 * @param {string|Date} createdAt - The date to compare against the current time.
 * @returns {string} - Human-readable time difference (e.g., '5 mins ago').
 */

export const getTimeStamp = (createdAt: string | Date): string => {
  // Ensure createdAt is a Date object
  const date = typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  const now = new Date();
  const diff = now.getTime() - date.getTime(); // difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} sec${seconds > 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

/**
 * Formats a Date object to display a "Joined" date (e.g., "Joined September 2024").
 *
 * @param {Date} date - The date to format.
 * @returns {string} - Formatted join date string.
 */

export function formatJoinDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return `Joined ${formattedDate}`;
}
export const formatToK = (value: number): string => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return value.toString();
};

/**
 * Constructs a URL with updated query parameters.
 *
 * @param {Object} params - The parameters to update in the URL.
 * @param {string} params.params - Existing query string.
 * @param {string} params.key - Key to add/update in the query string.
 * @param {string|null} params.value - Value to set for the key.
 * @returns {string} - Updated query string URL.
 */

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
}

/**
 * Removes specific keys from the query string.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.params - Existing query string.
 * @param {string[]} params.keys - Array of keys to remove from the query string.
 * @returns {string} - Updated URL without the specified keys.
 */

interface RemoveKeyParams {
  params: string;
  keys: string[];
}

export function removeKeyFromQuery({ params, keys }: RemoveKeyParams) {
  const currentUrl = qs.parse(params);
  keys.forEach((key) => {
    delete currentUrl[key];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
}

interface BadgeParams {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}
export function assignBadges(params: BadgeParams) {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };
  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
}

/**
 * Converts a Markdown string to TinyMCE-compatible HTML.
 *
 * @param {string} markdown - The markdown text to convert.
 * @returns {string} - Converted HTML string.
 */
export function formatForTinyMCE(markdown: string): string {
  // Replace newlines with paragraph tags
  // Convert headers (e.g., ## Heading)
  let html = markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Convert bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

  // Convert italic (*text*)
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Convert inline code (`code`)
  html = html.replace(/`(.*?)`/gim, "<code>$1</code>");

  // Convert block code (```code```) into <pre><code class="language-javascript"> for TinyMCE
  html = html.replace(
    /```(.*?)```/gim,
    '<pre class="language-javascript"><code>$1</code></pre>'
  );

  // Convert unordered lists (* list item)
  html = html
    .replace(/^\* (.*$)/gim, "<ul><li>$1</li></ul>")
    .replace(/<\/ul>\n<ul>/gim, ""); // merge adjacent lists

  // Convert newlines to <br> inside paragraphs
  html = html.replace(/\n/gim, "<br>");

  // Wrap the entire content in paragraph tags
  html = `<p>${html}</p>`;

  return html;
}

/**
 * Extracts plain text from an HTML string.
 *
 * @param {string} htmlString - The HTML content to extract text from.
 * @returns {string} - Extracted text content.
 */
export function extractTextFromHTML(htmlString: string): string {
  // Load the HTML string using cheerio
  const $ = cheerio.load(htmlString);

  // Extract and return the text content
  return $.text().trim().slice(0, 200);
}

/**
 * Fetches the first paragraph of a Wikipedia description for a given topic.
 *
 * @param {string} topic - The topic to search for.
 * @returns {Promise<string>} - The description text or error message.
 */

export async function fetchWikipediaDescription(topic: string) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&utf8=&format=json`;

  try {
    // Step 1: Search for the topic
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    // Check if there are search results
    if (searchData.query.search.length === 0) {
      return `No description available for ${topic}.`;
    }

    // Get the page ID of the first search result
    const pageId = searchData.query.search[0].pageid;

    // Step 2: Fetch the extract using the page ID
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&pageids=${pageId}`;
    const extractResponse = await fetch(extractUrl);
    const extractData = await extractResponse.json();

    // Return the extract
    const extract = extractData.query.pages[pageId].extract;
    return extract
      ? extract.split("\n")[0]
      : `No description available for ${topic}.`;
  } catch (error) {
    console.error(`Error fetching description for ${topic}:`, error);
    return `No description available for ${topic}.`;
  }
}

/**
 * Escapes special characters in a string for use in regular expressions.
 *
 * @param {string} string - The string to escape.
 * @returns {string} - The escaped string.
 */
export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes regex special characters
}
