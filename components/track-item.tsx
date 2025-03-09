"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Track } from "@/lib/types";
import { usePlayerStore } from "@/lib/store/store";
import * as motion from "motion/react-client";
import Spinner from "./ui/spinner";
import Image from "next/image";

interface TrackItemProps {
  track: Track;
  isActive?: boolean;
}

export const TrackItem = ({ track, isActive }: TrackItemProps) => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    setIsPlaying,
    setCurrentTrack,
    addToQueue,
    setShowPlayerBar,
  } = usePlayerStore();

  const handlePlay = () => {
    if (isLoading) return;

    if (currentTrack?.id === track.id) setIsPlaying(!isPlaying);
    else {
      if (!currentTrack) setShowPlayerBar(true);
      setCurrentTrack(track);
      addToQueue(track);
    }
  };

  const Icon = () => {
    if (isPlaying && isActive)
      return (
        <Pause
          size={32}
          weight="fill"
          className="text-cyan-200 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]"
        />
      );
    else if (isLoading && isActive) return <Spinner />;
    else
      return (
        <Play
          size={32}
          weight="fill"
          className={cn(
            "text-cyan-200 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]",
            isLoading && !isActive && "text-gray-600"
          )}
        />
      );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.8 }}
      className={cn(
        "flex justify-between items-center text-center p-4 rounded-lg group w-full",
        "bg-dark/50 border border-cyan-200/10",
        "transition-all duration-300",
        "hover:border-cyan-200/30",
        "hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]",
        isActive &&
          "border-pink-600/50 shadow-[0_0_20px_rgba(255,0,127,0.2)] hover:border-pink-600/50 hover:shadow-[0_0_20px_rgba(255,0,127,0.2)]"
      )}
      onClick={handlePlay}
    >
      <div className="relative">
        <Image
          src={track.thumbnail}
          alt={track.title}
          width={100}
          height={100}
          className="size-10 sm:size-16 rounded object-cover"
          priority
        />
        <button
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-black/50 opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200",
            "rounded"
          )}
          disabled={isLoading}
        >
          <Icon />
        </button>
      </div>

      <div className="w-40 sm:w-96">
        <h3 className="font-medium text-sm sm:text-[18px] text-white truncate">
          {track.title}
        </h3>
        <p className="text-sm text-gray-400">{track.artist}</p>
      </div>

      <div className="text-sm text-gray-400">
        {track.duration && (
          <>
            {Math.floor(track.duration / 60)}:
            {String(track.duration % 60).padStart(2, "0")}
          </>
        )}
      </div>
    </motion.div>
  );
};
