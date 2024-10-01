import { NextResponse } from "next/server";

const FINDWORK_API_URL = "https://findwork.dev/api/jobs/";
const API_KEY = process.env.FINDWORK_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const searchQuery = searchParams.get("q") || "development";
  const filter = searchParams.get("filter") || "newest";
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "20";

  const queryParams: Record<string, string | number | boolean> = {
    search: searchQuery,
    limit: pageSize,
    offset: (parseInt(page) - 1) * parseInt(pageSize),
  };

  // Set filter conditions
  if (filter === "full-time") {
    queryParams.employment_type = "full+time";
  } else if (filter === "remote") {
    queryParams.remote = true;
  } else if (filter === "part-time") {
    queryParams.employment_type = "part+time";
  } else if (filter === "newest") {
    queryParams.order_by = "date";
  }

  const queryString = new URLSearchParams(queryParams as any).toString();
  const apiUrl = `${FINDWORK_API_URL}?${queryString}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Token ${API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch jobs from the external API" },
        { status: response.status }
      );
    }

    const jobsData = await response.json();
    const isNext = jobsData.results.length > +page * +pageSize; // Updated for consistency
    const startIndex = (+page - 1) * +pageSize;
    const endIndex = +page * +pageSize;
    const results = isNext
      ? jobsData.results.slice(startIndex, endIndex)
      : jobsData.results;

    return NextResponse.json({ results, isNext });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "An internal error occurred while fetching jobs" },
      { status: 500 }
    );
  }
}
