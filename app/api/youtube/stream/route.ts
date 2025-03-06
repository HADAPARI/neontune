import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidYouTubeId } from "@/lib/utils";
import { spawn } from "child_process";
import { createReadStream, existsSync, mkdirSync } from "fs";
import { join } from "path";

const streamParamsSchema = z.object({
  videoId: z.string().refine((id) => isValidYouTubeId(id), {
    message: "Invalid YouTube video ID",
  }),
});

const DOWNLOADS_DIR = join(process.cwd(), "downloads");

// Créer le dossier downloads s'il n'existe pas
if (!existsSync(DOWNLOADS_DIR)) {
  mkdirSync(DOWNLOADS_DIR);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = streamParamsSchema.parse({
      videoId: searchParams.get("videoId"),
    });

    const audioPath = join(DOWNLOADS_DIR, `${validatedParams.videoId}.mp3`);

    // Si l'audio existe déjà, on le streame directement
    if (existsSync(audioPath)) {
      const stream = createReadStream(audioPath);
      return new Response(stream as any, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Accept-Ranges": "bytes",
        },
      });
    }

    // Utiliser directement la commande yt-dlp qui est dans le PATH
    const ytdlpCommand = "yt-dlp";

    // Sinon, on télécharge la vidéo et on la convertit en audio
    return new Promise((resolve, reject) => {
      const ytdl = spawn(ytdlpCommand, [
        `https://www.youtube.com/watch?v=${validatedParams.videoId}`,
        "--extract-audio",
        "--audio-format", "mp3",
        "--audio-quality", "0",
        "-o", audioPath,
      ]);

      ytdl.stderr.on("data", (data) => {
        console.error(`yt-dlp error: ${data}`);
      });

      ytdl.on("close", (code) => {
        if (code !== 0) {
          reject(
            new NextResponse(
              JSON.stringify({ error: "Failed to download audio" }),
              { status: 500 }
            )
          );
          return;
        }

        const stream = createReadStream(audioPath);
        resolve(
          new Response(stream as any, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Accept-Ranges": "bytes",
            },
          })
        );
      });
    });
  } catch (error) {
    console.error("Streaming error:", error);
    return NextResponse.json(
      { error: "Failed to stream audio" },
      { status: 500 }
    );
  }
} 