"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CompareItem {
  id: string;
  name: string;
  slug: string;
  url: string;
  logo_url?: string | null;
  pricing_model?: string;
}

interface CompareContextType {
  queuedTools: CompareItem[];
  addToCompare: (tool: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  toggleCompare: (tool: CompareItem) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "crawlers_compare_queue";

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queuedTools, setQueuedTools] = useState<CompareItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load queued tools from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setQueuedTools(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load compare queue from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save queued tools to localStorage whenever queue changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(queuedTools));
      } catch (e) {
        console.error("Failed to save compare queue to localStorage:", e);
      }
    }
  }, [queuedTools, isLoaded]);

  const addToCompare = (tool: CompareItem) => {
    setQueuedTools((prev) => {
      if (prev.some((t) => t.id === tool.id || t.slug === tool.slug)) {
        return prev;
      }
      return [...prev, tool];
    });
  };

  const removeFromCompare = (id: string) => {
    setQueuedTools((prev) => prev.filter((t) => t.id !== id && t.slug !== id));
  };

  const toggleCompare = (tool: CompareItem) => {
    setQueuedTools((prev) => {
      const exists = prev.some((t) => t.id === tool.id || t.slug === tool.slug);
      if (exists) {
        return prev.filter((t) => t.id !== tool.id && t.slug !== tool.slug);
      }
      return [...prev, tool];
    });
  };

  const isInCompare = (id: string) => {
    return queuedTools.some((t) => t.id === id || t.slug === id);
  };

  const clearCompare = () => {
    setQueuedTools([]);
  };

  return (
    <CompareContext.Provider
      value={{
        queuedTools,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
