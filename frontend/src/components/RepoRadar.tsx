import { RepoResult } from "../types";

interface RepoRadarProps {
  repos: RepoResult[];
}

/**
 * RepoRadar Component
 * Displays the repos found in the GitHub search as cards.
 */
export default function RepoRadar({ repos }: RepoRadarProps) {
  if (repos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No repos found yet. Enter an idea and click Scan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => (
        <a
          key={repo.url}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition"
        >
          <h3 className="font-bold text-blue-600 mb-2 truncate">{repo.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {repo.description || "(No description)"}
          </p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex flex-wrap gap-1">
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded"
                >
                  {topic}
                </span>
              ))}
            </div>
            <span className="text-yellow-500">⭐ {repo.stars}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
