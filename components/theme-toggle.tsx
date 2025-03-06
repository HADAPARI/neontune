'use client';

import { Moon, Sun, Desktop } from "@phosphor-icons/react";
import { useThemeStore } from "@/lib/store/theme-store";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const themes = [
  {
    value: "light",
    label: "Clair",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Sombre",
    icon: Moon,
  },
  {
    value: "system",
    label: "Système",
    icon: Desktop,
  },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <div className="fixed top-4 right-4">
      <Select value={theme} onValueChange={(value) => setTheme(value as typeof theme)}>
        <SelectTrigger
          className={cn(
            "w-[140px] border-2",
            "bg-white/50 dark:bg-black/50",
            "border-gray-200 dark:border-neon-blue/20",
            "text-gray-900 dark:text-white",
            "hover:border-neon-blue/50 dark:hover:border-neon-blue/50",
            "focus:ring-neon-blue/20"
          )}
        >
          <SelectValue placeholder="Thème" />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "border-2",
            "bg-white/80 dark:bg-black/80",
            "border-gray-200 dark:border-neon-blue/20",
            "backdrop-blur-sm"
          )}
        >
          {themes.map(({ value, label, icon: Icon }) => (
            <SelectItem
              key={value}
              value={value}
              className={cn(
                "flex items-center gap-2",
                "text-gray-900 dark:text-white",
                "hover:bg-gray-100 dark:hover:bg-neon-blue/10",
                "focus:bg-gray-100 dark:focus:bg-neon-blue/10",
                "cursor-pointer"
              )}
            >
              <Icon
                size={18}
                weight={theme === value ? "fill" : "regular"}
                className={cn(
                  theme === value
                    ? "text-neon-blue"
                    : "text-gray-500 dark:text-gray-400"
                )}
              />
              <span>{label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 