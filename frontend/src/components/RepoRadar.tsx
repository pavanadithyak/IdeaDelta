import { RepoResult } from "../types";

interface RepoRadarProps {
  repos: RepoResult[];
}

/**
 * RepoRadar Component
 * Displays repos found in GitHub search with glassmorphic styling.
 */
export default function RepoRadar({ repos }: RepoRadarProps) {
  if (repos.length === 0) {
    return (
      <div className="text-center py-8 text-white/50">
        No repos found yet. Enter an idea and click Scan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {repos.map((repo) => (
        <a
          key={repo.url}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 border border-white/10 rounded-xl bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] transition-all duration-200"
        >
          <h3 className="font-bold text-white mb-2 truncate hover:text-white/80">
            {repo.name}
          </h3>
          <p className="text-sm text-white/70 mb-3 line-clamp-2">
            {repo.description || "(No description)"}
          </p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex flex-wrap gap-1">
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-white/10 text-white/90 rounded border border-white/20"
                >
                  {topic}
                </span>
              ))}
            </div>
            <span className="text-white/80">⭐ {repo.stars}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
