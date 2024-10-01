export interface GetJobsParams {
  searchQuery?: string; // Search query (e.g., 'react')
  filter?: string; // Filter type (e.g., 'newest', 'remote', 'full-time')
  page?: number; // Current page (default is 1)
  pageSize?: number; // Number of jobs per page (default is 20)
}

const FINDWORK_API_URL = "https://findwork.dev/api/jobs/";
const API_KEY = process.env.FINDWORK_API_KEY;

export async function getAllJobs(params: GetJobsParams) {
  try {
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;

    const queryParams: Record<string, string | number | boolean> = {
      offset: skipAmount, // Use 'offset' for pagination
      limit: pageSize,
    };

    // Apply search query
    if (searchQuery) {
      queryParams.search = searchQuery;
    }

    // Handle filtering based on the filter parameter
    switch (filter) {
      case "remote":
        queryParams.remote = true;
        break;
      case "full-time":
        queryParams.employment_type = "full+time";
        break;
      case "part-time":
        queryParams.employment_type = "part+time";
        break;
      case "newest":
        queryParams.order_by = "date";
        break;
      default:
        break;
    }

    // Construct the final API URL
    const queryString = new URLSearchParams(queryParams as any).toString();
    const apiUrl = `${FINDWORK_API_URL}?${queryString}`;

    // Fetch jobs from the Findwork API
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Token ${API_KEY}`,
      },
    });

    if (!response.ok) {
      return { error: "Failed to fetch jobs", status: response.status };
    }

    const jobsData = await response.json();

    // Calculate if there's a next page
    const totalJobs = jobsData.count;
    const isNext = totalJobs > skipAmount + jobsData.results.length;

    return {
      jobs: jobsData.results,
      isNext,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("Failed to fetch jobs");
  }
}
