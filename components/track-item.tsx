'use client';

import { Play } from "@phosphor-icons/react";
import { cn, truncateText } from "@/lib/utils";
import type { Track } from "@/lib/types";

interface TrackItemProps {
  track: Track;
  isActive?: boolean;
  onPlay: (track: Track) => void;
}

export function TrackItem({ track, isActive, onPlay }: TrackItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg",
        "bg-dark/50 border border-neon-blue/10",
        "transition-all duration-300",
        "hover:border-neon-blue/30",
        "hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]",
        isActive && "border-neon-pink/50 shadow-[0_0_20px_rgba(255,0,127,0.2)]"
      )}
    >
      <div className="relative group">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-16 h-16 rounded object-cover"
        />
        <button
          onClick={() => onPlay(track)}
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-black/50 opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200",
            "rounded"
          )}
        >
          <Play
            size={32}
            weight="fill"
            className="text-neon-blue drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]"
          />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white">
          {truncateText(track.title, 50)}
        </h3>
        <p className="text-sm text-gray-400">
          {truncateText(track.artist, 40)}
        </p>
      </div>

      <div className="text-sm text-gray-400">
        {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, "0")}
      </div>
    </div>
  );
} 