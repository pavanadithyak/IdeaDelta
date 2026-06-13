import { useState } from "react";

interface IdeaInputProps {
  onSearch: (query: string) => Promise<void>;
  isLoading: boolean;
}

/**
 * IdeaInput Component
 * Text input for entering a project idea and triggering a search.
 */
export default function IdeaInput({ onSearch, isLoading }: IdeaInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await onSearch(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your idea..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Scanning..." : "Scan"}
        </button>
      </div>
    </form>
  );
}
