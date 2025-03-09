import { NextResponse } from "next/server";
import { z } from "zod";
import type { Track, YouTubeSearchResult } from "@/lib/types";
import { getVideoDetails, searchInYoutube } from "@/lib/actions/youtube.action";
import { parseDuration } from "@/lib/utils";

const searchParamsSchema = z.object({
  q: z.string().min(1),
  pageToken: z.string().nullish(),
});

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = searchParamsSchema.parse({
      q: searchParams.get("q"),
      pageToken: searchParams.get("pageToken"),
    });

    const searchData = await searchInYoutube({
      query: validatedParams.q,
      pageToken: validatedParams.pageToken,
    });

    // Filtrer les résultats qui contiennent le mot clé dans le titre ou le nom de l'artiste
    const searchTerms = validatedParams.q.toLowerCase().split(" ");
    const filteredItems = searchData?.items?.filter(
      (item: YouTubeSearchResult) => {
        const title = item.snippet.title.toLowerCase();
        const artist = item.snippet.channelTitle.toLowerCase();

        // Vérifie si tous les mots clés sont présents soit dans le titre soit dans le nom de l'artiste
        return searchTerms.every(
          (term) => title.includes(term) || artist.includes(term)
        );
      }
    );

    const videoIds = filteredItems?.map(
      (item: YouTubeSearchResult) => item.id.videoId
    );

    if (!videoIds || videoIds?.length === 0) {
      return NextResponse.json({
        items: [],
        totalResults: 0,
      });
    }

    // Récupération des détails des vidéos (notamment la durée)
    const detailsData = await getVideoDetails(videoIds);

    // Fusion des résultats
    const tracks = filteredItems.map((item: YouTubeSearchResult) => {
      const details = detailsData.items.find(
        (detail: any) => detail.id === item.id.videoId
      );

      // Conversion de la durée ISO 8601 en secondes
      const duration = details?.contentDetails?.duration
        ? parseDuration(details.contentDetails.duration)
        : 0;

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration,
      };
    });

    return NextResponse.json({
      items: tracks,
      nextPageToken: searchData.nextPageToken,
      totalResults: tracks.length,
    });
  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json(
      { error: "Failed to search YouTube" },
      { status: 500 }
    );
  }
};
