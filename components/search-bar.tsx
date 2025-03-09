"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { SearchResults } from "./search-results";
import { useEffect, useState } from "react";
import type { SearchResponse } from "@/lib/types";
import { usePlayerStore } from "@/lib/store/store";
import { ScrollArea } from "./ui/scroll-area";

const searchSchema = z.object({
  query: z.string().min(1, "La recherche ne peut pas être vide"),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchBarProps {
  setIsLoading: (isLoading: boolean) => void;
  setTerm: (term: string) => void;
}

export const SearchBar = ({ setIsLoading, setTerm }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { setPlaylist } = usePlayerStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>();

  const { data: searchResults, isLoading } = useQuery<SearchResponse>({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return { items: [], totalResults: 0 };
      const response = await fetch(
        `/api/youtube/search?q=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      return response.json();
    },
    enabled: searchTerm.length > 0,
  });

  const onSubmit = async (data: SearchFormData) => {
    setSearchTerm(data.query);
  };

  useEffect(() => {
    if (!searchResults) return;
    setPlaylist(searchResults.items);
  }, [searchResults]);

  useEffect(() => {
    if (!searchTerm) return;
    setTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative w-full"
    >
      <div
        className={cn(
          "relative flex items-center rounded-full",
          "bg-gray-100 dark:bg-black/30",
          "border-2 border-gray-200 dark:border-cyan-200",
          "shadow-sm dark:shadow-[0_0_15px_rgba(0,255,255,0.3)]",
          "transition-all duration-300",
          "hover:border-cyan-200 dark:hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]",
          "focus-within:border-cyan-200 dark:focus-within:shadow-[0_0_35px_rgba(0,255,255,0.7)]"
        )}
      >
        <input
          type="text"
          placeholder="Rechercher un titre ou un artiste..."
          className={cn(
            "w-full px-6 py-4 bg-transparent",
            "text-gray-900 dark:text-white",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "focus:outline-none",
            "rounded-full"
          )}
          {...register("query")}
        />
        <button
          type="submit"
          className={cn(
            "absolute right-2 p-2",
            "rounded-full",
            "bg-gray-200 dark:bg-cyan-200/10",
            "text-gray-600 dark:text-cyan-200",
            "hover:bg-cyan-200/20 hover:text-cyan-200 dark:hover:text-white",
            "transition-colors"
          )}
        >
          <MagnifyingGlass size={24} weight="bold" />
        </button>
      </div>
      {errors.query && (
        <p className="mt-2 text-sm text-red-500 dark:text-pink-600">
          {errors.query.message}
        </p>
      )}
    </form>
  );
};
