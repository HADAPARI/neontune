import { NextResponse } from "next/server";
import { z } from "zod";
import type { YouTubeSearchResult } from "@/lib/types";

const searchParamsSchema = z.object({
  q: z.string().min(1),
  pageToken: z.string().nullish(),
});

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = searchParamsSchema.parse({
      q: searchParams.get("q"),
      pageToken: searchParams.get("pageToken"),
    });

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      );
    }

    // Recherche initiale pour obtenir les IDs des vidéos
    const searchResponse = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&type=video&maxResults=50&q=${encodeURIComponent(
        validatedParams.q
      )}&key=${YOUTUBE_API_KEY}${
        validatedParams.pageToken
          ? `&pageToken=${validatedParams.pageToken}`
          : ""
      }`
    );

    if (!searchResponse.ok) {
      throw new Error("Failed to fetch from YouTube API");
    }

    const searchData = await searchResponse.json();
    
    // Filtrer les résultats qui contiennent le mot clé dans le titre ou le nom de l'artiste
    const searchTerms = validatedParams.q.toLowerCase().split(" ");
    const filteredItems = searchData.items.filter((item: YouTubeSearchResult) => {
      const title = item.snippet.title.toLowerCase();
      const artist = item.snippet.channelTitle.toLowerCase();
      
      // Vérifie si tous les mots clés sont présents soit dans le titre soit dans le nom de l'artiste
      return searchTerms.every(term => 
        title.includes(term) || artist.includes(term)
      );
    });

    const videoIds = filteredItems.map(
      (item: YouTubeSearchResult) => item.id.videoId
    );

    if (videoIds.length === 0) {
      return NextResponse.json({
        items: [],
        totalResults: 0,
      });
    }

    // Récupération des détails des vidéos (notamment la durée)
    const detailsResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=contentDetails&id=${videoIds.join(
        ","
      )}&key=${YOUTUBE_API_KEY}`
    );

    if (!detailsResponse.ok) {
      throw new Error("Failed to fetch video details from YouTube API");
    }

    const detailsData = await detailsResponse.json();

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
}

// Fonction utilitaire pour convertir la durée ISO 8601 en secondes
function parseDuration(duration: string): number {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return 0;

  const [, hours, minutes, seconds] = matches;
  return (
    (parseInt(hours || "0") * 3600 +
      parseInt(minutes || "0") * 60 +
      parseInt(seconds || "0")) ||
    0
  );
} 