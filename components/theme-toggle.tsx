"use client";

import { Moon, Sun, Desktop } from "@phosphor-icons/react";
import { useThemeStore } from "@/lib/store/theme.store";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

interface ThemeToggleProps {
  type: "select" | "toggle";
  className?: string;
}

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

export const ThemeToggle = ({ type, className }: ThemeToggleProps) => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const handleChangeTheme = () => {
    const currentIndex = themes.findIndex((t) => t.value === theme);

    if (currentIndex === themes.length - 1) {
      setTheme(themes[0].value);
    } else {
      setTheme(themes[currentIndex + 1].value);
    }
  };

  const ThemeUI = () => {
    if (type === "select") {
      return (
        <Select
          value={theme}
          onValueChange={(value) => setTheme(value as typeof theme)}
        >
          <SelectTrigger
            className={cn(
              "w-[140px] border-2",
              "bg-white/50 dark:bg-black/50",
              "border-gray-200 dark:border-cyan-200/20",
              "text-gray-900 dark:text-white",
              "hover:border-cyan-200/50 dark:hover:border-cyan-200/50",
              "focus:ring-cyan-200/20"
            )}
          >
            <SelectValue placeholder="Thème" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              "border-2",
              "bg-white/80 dark:bg-black/80",
              "border-gray-200 dark:border-cyan-200/20",
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
                  "hover:bg-gray-100 dark:hover:bg-cyan-200/10",
                  "focus:bg-gray-100 dark:focus:bg-cyan-200/10",
                  "cursor-pointer"
                )}
              >
                <Icon
                  size={18}
                  weight={theme === value ? "fill" : "regular"}
                  className={cn(
                    theme === value
                      ? "text-cyan-200"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                />
                <span>{label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (type === "toggle") {
      return (
        <Button
          onClick={handleChangeTheme}
          className="text-pink-600 hover:text-cyan-600 border-gray-200/20 border dark:border-cyan-200/20 bg-white/10 dark:bg-black/50 backdrop-blur-lg"
        >
          {theme === "light" && <Sun size={24} />}
          {theme === "dark" && <Moon size={24} />}
          {theme === "system" && <Desktop size={24} />}
        </Button>
      );
    }
  };

  return (
    <div className={cn("fixed top-4 right-4", className)}>
      <ThemeUI />
    </div>
  );
};
