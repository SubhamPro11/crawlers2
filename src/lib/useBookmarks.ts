"use client";

import { useState } from "react";

const BOOKMARKS_KEY = "crawlers_user_bookmarks_v1";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (toolId: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];

      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      } catch {
        // Ignore local storage error
      }
      return next;
    });
  };

  const isBookmarked = (toolId: string) => bookmarks.includes(toolId);

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
  };
}
