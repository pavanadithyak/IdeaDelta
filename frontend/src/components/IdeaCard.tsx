import { Idea } from "../types";

interface IdeaCardProps {
  idea: Idea;
}

/**
 * IdeaCard Component
 * Displays a mutated idea with glassmorphic styling.
 */
export default function IdeaCard({ idea }: IdeaCardProps) {
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(idea.copilotPrompt);
  };

  return (
    <div className="space-y-4 text-white">
      <div>
        <h2 className="text-2xl font-bold mb-2">{idea.name}</h2>
        <p className="text-lg text-white/80 italic">{idea.tagline}</p>
      </div>

      <p className="text-white/90">{idea.description}</p>

      <div>
        <h3 className="font-semibold mb-2 text-white">Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {idea.keywords.map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 bg-white/10 text-white/90 rounded-full text-sm border border-white/20"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-white">Copilot Prompt</h3>
        <div className="p-3 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-lg">
          <p className="text-sm text-white/80 break-words">
            {idea.copilotPrompt}
          </p>
        </div>
      </div>

      <button
        onClick={handleCopyPrompt}
        className="w-full px-4 py-2 bg-white/[0.15] text-white rounded-lg border border-white/20 hover:bg-white/[0.25] transition-all duration-200 font-medium"
      >
        Copy Prompt
      </button>
    </div>
  );
}
