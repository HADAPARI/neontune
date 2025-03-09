"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  SpeakerHigh,
  SpeakerX,
} from "@phosphor-icons/react";
import { formatDuration } from "@/lib/utils";
import { usePlayerStore } from "@/lib/store/store";
import Range from "./ui/range";
import Spinner from "./ui/spinner";

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    playNext,
    playPrevious,
    volume,
    setVolume,
    isLoading,
    setIsLoading,
  } = usePlayerStore();

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume / 100;
    localStorage.setItem("volume", volume.toString());
    if (isMuted && volume > 0) setIsMuted(false);
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.warn("Lecture bloquée par le navigateur :", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    const volumeStored = localStorage.getItem("volume");
    if (volumeStored) {
      setVolume(Number.parseFloat(volumeStored));
    }

    const audioUrl = `/api/youtube/stream?videoId=${currentTrack.id}`;
    const audio = audioRef.current;

    if (isPlaying) setIsPlaying(false);

    audio.src = audioUrl;
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsLoading(true);
    

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => playNext();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener(
      "canplay",
      () => {
        setIsLoading(false);
        setIsPlaying(true);
      },
      { once: true }
    );

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", () => {
        setIsLoading(false);
        setIsPlaying(true);
      });
    };
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = isMuted;
  }, [isMuted]);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="bg-white/10 w-full dark:bg-black/50 backdrop-blur-lg border-t border-gray-200/20 dark:border-cyan-200/20">
      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Thumbnail et infos */}
          <div className="flex items-center gap-3 max-w-64">
            <div className="w-12 h-12 shrink-0">
              {isLoading ? (
                <div className="w-full h-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              ) : (
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-full h-full rounded object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1 hidden lg:block">
              {isLoading ? (
                <>
                  <div className="h-5 w-full max-w-[200px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                  <div className="h-4 w-[160px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {currentTrack.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {currentTrack.artist}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex flex-col items-center mx-auto">
            <div className="flex items-center justify-center gap-4">
              <button
                className="text-gray-600 dark:text-cyan-200 hover:text-cyan-200 dark:hover:text-white transition-colors"
                onClick={playPrevious}
                disabled={isLoading}
              >
                <SkipBack
                  size={24}
                  weight="duotone"
                  className={isLoading ? "opacity-50" : ""}
                />
              </button>
              <button
                className="text-gray-600 dark:text-cyan-200 hover:text-cyan-200 dark:hover:text-white transition-colors"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isLoading}
              >
                {isPlaying ? (
                  <Pause
                    size={32}
                    weight="duotone"
                    className={isLoading ? "opacity-50" : ""}
                  />
                ) : isLoading ? (
                  <Spinner className="border-t-cyan-200/50" />
                ) : (
                  <Play
                    size={32}
                    weight="duotone"
                    className={isLoading ? "opacity-50" : ""}
                  />
                )}
              </button>
              <button
                className="text-gray-600 dark:text-cyan-200 hover:text-cyan-200 dark:hover:text-white transition-colors"
                onClick={playNext}
                disabled={isLoading}
              >
                <SkipForward
                  size={24}
                  weight="duotone"
                  className={isLoading ? "opacity-50" : ""}
                />
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mt-2">
              <span className="w-7 text-xs text-gray-600 dark:text-gray-400">
                {formatDuration(currentTime)}
              </span>
              <Range
                value={currentTime}
                max={duration || 0}
                step={1}
                onChange={handleSeek}
                disabled={isLoading}
                className="h-1 md:text-4xl accent-cyan-300"
              />
              <span className="w-7 text-xs text-gray-600 dark:text-gray-400">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Volume control */}
          <div className="hidden sm:flex items-center gap relative group">
            <button
              onClick={toggleMute}
              className="text-gray-600 dark:text-cyan-200 hover:text-cyan-200 dark:hover:text-white transition-colors border-2 rounded-xl border-gray-200/20 dark:border-cyan-200/20 p-2 lg:border-none"
            >
              {isMuted ? (
                <SpeakerX size={24} weight="duotone" />
              ) : (
                <SpeakerHigh size={24} weight="duotone" />
              )}
            </button>
            <div className="hidden group-hover:flex -rotate-90 absolute z-1 -start-21 -top-29 border-2 rounded-full bg-white/10 dark:bg-black/50 backdrop-blur-lg border-t border-gray-200/20 dark:border-cyan-200/20 lg:static lg:rotate-none lg:border-none lg:flex items-center p-2">
              <Range
                value={volume}
                step={1}
                onChange={handleVolumeChange}
                className="h-1 accent-cyan-300"
              />
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};
