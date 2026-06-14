import { useState } from "react";
import { Idea } from "../types";

interface IdeaCardProps {
  idea: Idea;
  noveltyScore: number;
}

/**
 * IdeaCard Component
 * Displays a mutated idea with novelty score, Foundry IQ badge,
 * copy-to-clipboard buttons, and a Copilot deep-link.
 */
export default function IdeaCard({ idea, noveltyScore }: IdeaCardProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(idea.copilotPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyBrief = () => {
    const markdown = `# ${idea.name}
**Tagline:** ${idea.tagline}
**Description:** ${idea.description}
**Keywords:** ${idea.keywords.join(", ")}
## GitHub Copilot Prompt
${idea.copilotPrompt}`;
    navigator.clipboard.writeText(markdown);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - noveltyScore / 100);
  const arcColor =
    noveltyScore > 70
      ? "#22c55e"
      : noveltyScore > 40
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="space-y-4 text-white">
      {/* Header row with name + novelty score */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold">{idea.name}</h2>
          <p className="text-lg text-white/80 italic">{idea.tagline}</p>
        </div>
        <div
          className="relative shrink-0"
          title={`Novelty score: how uncharted this idea space is based on existing GitHub repos and their popularity`}
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="20"
              cy="20"
              r={radius}
              fill="none"
              stroke={arcColor}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 20 20)"
            />
            <text
              x="20"
              y="20"
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize="10"
              fontWeight="600"
            >
              {noveltyScore}
            </text>
          </svg>
        </div>
      </div>

      <p className="text-white/90">{idea.description}</p>

      {/* Keywords */}
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

      {/* Foundry IQ badge */}
      <span className="inline-flex items-center gap-1.5 text-xs text-blue-300/80 bg-blue-500/10 border border-blue-400/20 px-3 py-1 rounded-full">
        ⚡ Grounded by Microsoft Foundry IQ
      </span>

      {/* Copilot Prompt */}
      <div>
        <h3 className="font-semibold mb-2 text-white">Copilot Prompt</h3>
        <div className="p-3 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-lg">
          <p className="text-sm text-white/80 break-words">
            {idea.copilotPrompt}
          </p>
        </div>
      </div>

      {/* Copy Prompt button */}
      <button
        onClick={handleCopyPrompt}
        className="w-full px-4 py-2 bg-white/[0.15] text-white rounded-lg border border-white/20 hover:bg-white/[0.25] transition-all duration-200 font-medium"
      >
        {copiedPrompt ? "Copied!" : "Copy Prompt"}
      </button>

      {/* Copy full brief button */}
      <button
        onClick={handleCopyBrief}
        className="w-full mt-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white/80 text-sm hover:bg-white/20 transition-all duration-200"
      >
        {copiedBrief ? "Copied!" : "Copy full brief"}
      </button>

      {/* Build this in Copilot Chat deep-link */}
      <a
        href={`vscode://GitHub.copilot/openChat?message=${encodeURIComponent(idea.copilotPrompt)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-2 py-2 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/20 no-underline"
      >
        🤖 Build this in Copilot Chat
      </a>
    </div>
  );
}
