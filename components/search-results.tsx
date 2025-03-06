'use client';

import { usePlayerStore } from "@/lib/store";
import type { Track } from "@/lib/types";
import { TrackItem } from "./track-item";

interface SearchResultsProps {
  results: Track[];
  isLoading?: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const { setCurrentTrack, addToQueue, currentTrack } = usePlayerStore();

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
    addToQueue(track);
  };

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-dark/50"
          >
            <div className="w-16 h-16 bg-gray-700 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400">
        Aucun résultat trouvé
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4 pb-24">
      {results.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          isActive={currentTrack?.id === track.id}
          onPlay={handlePlay}
        />
      ))}
    </div>
  );
} 