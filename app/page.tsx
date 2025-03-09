"use client";

import { AudioPlayer } from "@/components/audio-player";
import { SearchBar } from "@/components/search-bar";
import { SearchResults } from "@/components/search-results";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SITE_CONFIG } from "@/lib/constants";
import { usePlayerStore } from "@/lib/store/store";
import { cn } from "@/lib/utils";
import { MusicNoteSimple } from "@phosphor-icons/react";
import { useState } from "react";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { showPlayerBar, setShowPlayerBar, currentTrack } = usePlayerStore();

  return (
    <main className="h-screen border bg-white dark:bg-[#0A0A0A] flex flex-col items-center justify-between">
      <div
        className={cn(
          "flex flex-col items-center justify-center pt-4 space-y-8 w-full px-5 md:px-0 md:w-2xl",
          showPlayerBar ? "h-[calc(100vh-5.5rem)]" : "h-screen"
        )}
      >
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter bg-gradient-to-r from-cyan-200 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {SITE_CONFIG.name}
        </h1>
        <p className="sm:text-xl text-center text-gray-600 dark:text-gray-300">
          {SITE_CONFIG.description}
        </p>
        <SearchBar setTerm={setSearchTerm} setIsLoading={setIsLoading} />
        {searchTerm && (
          <ScrollArea className="mb-4 flex-1 overflow-auto w-full">
            <SearchResults isLoading={isLoading} />
          </ScrollArea>
        )}
      </div>
      <div className="w-full relative">
        <Button
          className={cn(
            "absolute right-4 -top-[2.2rem] z-1 sm:z-0 lg:z-1 rounded-b-none text-pink-600 hover:text-cyan-600 border-b-0 border-gray-200/20 dark:border-cyan-200/20 bg-white/10 dark:bg-black/50 backdrop-blur-lg",
            currentTrack ? "block" : "hidden"
          )}
          variant={"outline"}
          onClick={() => setShowPlayerBar(!showPlayerBar)}
        >
          <MusicNoteSimple size={32} />
        </Button>
        <div
          className={cn(
            "transition-all duration-1000",
            showPlayerBar ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <AudioPlayer />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
