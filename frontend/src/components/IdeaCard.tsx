import { Idea } from "../types";

interface IdeaCardProps {
  idea: Idea;
}

/**
 * IdeaCard Component
 * Displays a mutated idea with name, tagline, description, keywords, and Copilot prompt.
 * Includes a copy-to-clipboard button for the Copilot prompt.
 */
export default function IdeaCard({ idea }: IdeaCardProps) {
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(idea.copilotPrompt);
  };

  return (
    <div className="p-6 border border-gray-300 rounded-lg bg-white hover:shadow-lg transition">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">{idea.name}</h2>
      <p className="text-lg text-gray-600 mb-4 italic">{idea.tagline}</p>

      <p className="text-gray-700 mb-4">{idea.description}</p>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {idea.keywords.map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h3 className="font-semibold text-gray-800 mb-2">Copilot Prompt</h3>
        <p className="text-sm text-gray-700 break-words">
          {idea.copilotPrompt}
        </p>
      </div>

      <button
        onClick={handleCopyPrompt}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Copy Prompt
      </button>
    </div>
  );
}
