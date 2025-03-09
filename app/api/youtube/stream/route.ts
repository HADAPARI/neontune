import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidYouTubeId } from "@/lib/utils";
import { spawn } from "child_process";

const streamParamsSchema = z.object({
  videoId: z.string().refine((id) => isValidYouTubeId(id), {
    message: "Invalid YouTube video ID",
  }),
});

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = streamParamsSchema.parse({
      videoId: searchParams.get("videoId"),
    });

    const ytdlpCommand = "yt-dlp";
    const ytdl = spawn(ytdlpCommand, [
      "-f",
      "bestaudio",
      "-o",
      "-",
      "--no-playlist",
      "--quiet",
      "--no-warnings",
      `https://www.youtube.com/watch?v=${validatedParams.videoId}`,
    ]);

    ytdl.stderr.on("data", (data) => {
      console.error(`yt-dlp error: ${data}`);
    });

    return new Response(ytdl.stdout as any, {
      headers: {
        "Content-Type": "audio/webm", // Par défaut, YouTube utilise souvent WebM Opus
        "Transfer-Encoding": "chunked",
        "Content-Disposition": "inline",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Streaming error:", error);
    return NextResponse.json(
      { error: "Failed to stream audio" },
      { status: 500 }
    );
  }
};
