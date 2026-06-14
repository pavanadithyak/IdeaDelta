import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ideadelta-history";
const MAX_ITEMS = 5;

interface UseIdeaHistoryReturn {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
}

export function useIdeaHistory(): UseIdeaHistoryReturn {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const deduped = prev.filter((item) => item !== query);
      return [query, ...deduped].slice(0, MAX_ITEMS);
    });
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setHistory((prev) => prev.filter((item) => item !== query));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
