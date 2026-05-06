"use client";

import * as React from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const THEME_EVENT = "app-theme-change";

const getSavedTheme = (): Theme | null => {
  if (typeof window === "undefined") return null;
  const savedTheme = window.localStorage.getItem("theme");
  return savedTheme === "dark" || savedTheme === "light" ? savedTheme : null;
};

const getPreferredTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getThemeFromDom = (): Theme => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const applyThemeToDom = (theme: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const getSnapshot = (): Theme => getThemeFromDom();
const getServerSnapshot = (): Theme => "light";

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => {};

  const handler = () => onStoreChange();
  window.addEventListener(THEME_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(THEME_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  React.useEffect(() => {
    const initialTheme = getSavedTheme() ?? getPreferredTheme();
    applyThemeToDom(initialTheme);
    window.dispatchEvent(new Event(THEME_EVENT));

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      // Respect explicit user choice from localStorage.
      if (getSavedTheme()) return;
      applyThemeToDom(getPreferredTheme());
      window.dispatchEvent(new Event(THEME_EVENT));
    };

    media.addEventListener("change", onMediaChange);
    return () => media.removeEventListener("change", onMediaChange);
  }, []);

  const setTheme = React.useCallback((nextTheme: Theme) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("theme", nextTheme);
    applyThemeToDom(nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme,
    }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

