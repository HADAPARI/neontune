'use client';

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, SpeakerHigh, SpeakerX } from "@phosphor-icons/react";
import { cn, formatDuration } from "@/lib/utils";
import { usePlayerStore } from "@/lib/store";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentTrack, isPlaying, togglePlay, playNext, playPrevious, volume, setVolume } = usePlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

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

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [playNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audioUrl = `/api/youtube/stream?videoId=${currentTrack.id}`;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsLoading(true);
      
      audioRef.current.src = audioUrl;
      
      audioRef.current.addEventListener('canplay', () => {
        setIsLoading(false);
        if (isPlaying) {
          audioRef.current?.play();
        }
      }, { once: true });
    }
  }, [currentTrack, isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.muted = newMutedState;
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 dark:bg-black/50 backdrop-blur-lg border-t border-gray-200/20 dark:border-neon-blue/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Thumbnail et infos */}
          <div className="flex items-center gap-3 w-[300px]">
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
            <div className="min-w-0 flex-1">
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
          <div className="flex-1 max-w-[500px] mx-auto">
            <div className="flex items-center justify-center gap-4">
              <button
                className="text-gray-600 dark:text-neon-blue hover:text-neon-blue dark:hover:text-white transition-colors"
                onClick={playPrevious}
                disabled={isLoading}
              >
                <SkipBack size={24} weight="fill" className={isLoading ? "opacity-50" : ""} />
              </button>
              <button
                className="text-gray-600 dark:text-neon-blue hover:text-neon-blue dark:hover:text-white transition-colors"
                onClick={togglePlay}
                disabled={isLoading}
              >
                {isPlaying ? (
                  <Pause size={32} weight="fill" className={isLoading ? "opacity-50" : ""} />
                ) : (
                  <Play size={32} weight="fill" className={isLoading ? "opacity-50" : ""} />
                )}
              </button>
              <button
                className="text-gray-600 dark:text-neon-blue hover:text-neon-blue dark:hover:text-white transition-colors"
                onClick={playNext}
                disabled={isLoading}
              >
                <SkipForward size={24} weight="fill" className={isLoading ? "opacity-50" : ""} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px] text-right">
                {formatDuration(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                disabled={isLoading}
                className={cn(
                  "flex-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full",
                  "appearance-none cursor-pointer",
                  "[&::-webkit-slider-thumb]:appearance-none",
                  "[&::-webkit-slider-thumb]:w-3",
                  "[&::-webkit-slider-thumb]:h-3",
                  "[&::-webkit-slider-thumb]:rounded-full",
                  "[&::-webkit-slider-thumb]:bg-neon-blue",
                  "dark:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,255,0.5)]",
                  isLoading && "opacity-50"
                )}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px]">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2 min-w-[150px]">
            <button
              onClick={toggleMute}
              className="text-gray-600 dark:text-neon-blue hover:text-neon-blue dark:hover:text-white transition-colors"
            >
              {isMuted ? (
                <SpeakerX size={24} weight="fill" />
              ) : (
                <SpeakerHigh size={24} weight="fill" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className={cn(
                "flex-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full",
                "appearance-none cursor-pointer",
                "[&::-webkit-slider-thumb]:appearance-none",
                "[&::-webkit-slider-thumb]:w-3",
                "[&::-webkit-slider-thumb]:h-3",
                "[&::-webkit-slider-thumb]:rounded-full",
                "[&::-webkit-slider-thumb]:bg-neon-blue",
                "dark:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
              )}
            />
          </div>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
} 