"use server";

import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "../constants";

interface searchInYoutubePropos {
  query: string;
  pageToken?: string | null;
}

export const searchInYoutube = async ({
  query,
  pageToken,
}: searchInYoutubePropos): Promise<any> => {
  if (!query) {
    throw new Error("A query is required");
  }
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.length === 0) {
    throw new Error("YOUTUBE_API_KEY is required");
  }

  let searchData;

  for (const key in YOUTUBE_API_KEY) {
    const apiKey = YOUTUBE_API_KEY[key];
    searchData = await fetchData({ query, pageToken, apiKey });
    if (!searchData.error) {
      break;
    }
  }

  return searchData;
};

interface FecthDataProps extends searchInYoutubePropos {
  apiKey: string;
}

const fetchData = async ({ query, pageToken, apiKey }: FecthDataProps) => {
  const searchResponse = await fetch(
    `${YOUTUBE_API_URL}/search?part=snippet&type=video&maxResults=50&q=${encodeURIComponent(
      query
    )}&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ""}`
  );

  if (searchResponse.status !== 200) {
    console.error("Failed to fetch from YouTube API: ", apiKey);
  }

  return await searchResponse.json();
};
