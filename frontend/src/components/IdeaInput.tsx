import { useState, useEffect, useRef } from "react";

interface IdeaInputProps {
  onSearch: (query: string) => Promise<void>;
  isLoading: boolean;
  setIsExpanded?: (v: boolean) => void;
}

/**
 * IdeaInput Component
 * High-contrast white pill search bar with black text.
 */
export default function IdeaInput({
  onSearch,
  isLoading,
  setIsExpanded,
}: IdeaInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await onSearch(input);
    }
  };

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!input.trim()) {
          setIsExpanded?.(false);
          el.blur();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [input, setIsExpanded]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsExpanded?.(true)}
            onBlur={() => {
              if (!input.trim()) setIsExpanded?.(false);
            }}
            placeholder="Describe your idea..."
            className="w-full px-5 py-3 rounded-full bg-white text-black placeholder-gray-500 shadow-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-60"
            disabled={isLoading}
          />
          {/* Search icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:from-blue-400 hover:to-indigo-500 disabled:opacity-80 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Scanning...
            </span>
          ) : (
            "Scan"
          )}
        </button>
      </div>
    </form>
  );
}
