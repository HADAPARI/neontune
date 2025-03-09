"use client";

import { usePlayerStore } from "@/lib/store/store";
import { TrackItem } from "./track-item";
import { Skeleton } from "./ui/skeleton";

interface SearchResultsProps {
  isLoading: boolean;
}

export const SearchResults = ({ isLoading }: SearchResultsProps) => {
  const { currentTrack, playlist } = usePlayerStore();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex justify-between items-center p-4 rounded-lg bg-dark/50 border"
          >
            <Skeleton className="size-10 sm:size-16 rounded" />
            <div className="flex flex-col items-center space-y-2 w-40 sm:w-96">
              <Skeleton className="h-3 sm:h-4 rounded w-full" />
              <Skeleton className="h-2 sm:h-3 rounded w-1/2" />
            </div>
            <Skeleton className="w-5 h-2 sm:h-3 rounded" />
          </Skeleton>
        ))}
      </div>
    );
  }

  if (playlist.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400">
        Aucun résultat trouvé
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {playlist.map((track, key) => (
        <TrackItem
          key={key}
          track={track}
          isActive={currentTrack?.id === track.id}
        />
      ))}
    </div>
  );
};
