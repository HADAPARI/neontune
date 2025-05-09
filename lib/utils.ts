import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function generateThumbnailUrl(
  videoId: string,
  quality: "default" | "medium" | "high" = "medium"
): string {
  const qualities = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
  };
  return `https://img.youtube.com/vi/${videoId}/${qualities[quality]}.jpg`;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function isValidYouTubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

// Fonction utilitaire pour convertir la durée ISO 8601 en secondes
export const parseDuration = (duration: string): number => {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return 0;

  const [, hours, minutes, seconds] = matches;
  return (
    parseInt(hours || "0") * 3600 +
      parseInt(minutes || "0") * 60 +
      parseInt(seconds || "0") || 0
  );
};
