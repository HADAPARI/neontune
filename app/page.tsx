import { SearchBar } from "@/components/search-bar";
import { SITE_CONFIG } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white dark:bg-[#0A0A0A]">
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <h1 className="text-6xl font-bold tracking-tighter animate-neon-pulse bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
          {SITE_CONFIG.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {SITE_CONFIG.description}
        </p>
        <SearchBar />
      </div>
    </main>
  );
}
