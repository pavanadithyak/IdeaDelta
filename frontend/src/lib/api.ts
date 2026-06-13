import { SearchResponse, RepoResult } from "../types";

/**
 * GitHub API client for IdeaDelta.
 *
 * This module calls the GitHub REST Search API directly from the browser
 * without any backend proxy. Authentication is intentionally omitted —
 * the unauthenticated rate limit (10 requests/minute) is sufficient for
 * a single user's interactive searches. Do not add a GitHub token to
 * this code; it would be exposed to anyone viewing the deployed site.
 */

interface GitHubSearchItem {
  full_name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  stargazers_count: number;
}

interface GitHubSearchResponse {
  items: GitHubSearchItem[];
}

// Stop words for query building (more conservative)
const QUERY_STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "tool",
  "that",
  "app",
  "for",
  "with",
  "this",
  "your",
]);

// Extended stop words for variable extraction
const VARIABLE_STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "into",
  "when",
  "where",
  "which",
  "using",
  "can",
  "will",
  "more",
  "than",
]);

/**
 * Extract words for search query (4+ chars, excluding query stop words).
 */
function extractQueryWords(text: string): string[] {
  return (
    text
      .toLowerCase()
      .match(/\b\w+\b/g)
      ?.filter((word) => word.length >= 4 && !QUERY_STOP_WORDS.has(word)) || []
  );
}

/**
 * Extract meaningful words from text (4+ chars, excluding variable stop words).
 */
function extractMeaningfulWords(text: string): string[] {
  return (
    text
      .toLowerCase()
      .match(/\b\w+\b/g)
      ?.filter((word) => word.length >= 4 && !VARIABLE_STOP_WORDS.has(word)) ||
    []
  );
}

/**
 * Extract and count variables from repos.
 * Collects all topics plus meaningful words from descriptions.
 * Returns the top 8 most frequent unique terms.
 */
function extractVariables(repos: RepoResult[]): string[] {
  const frequencyMap = new Map<string, number>();

  repos.forEach((repo) => {
    // Count topics
    repo.topics.forEach((topic) => {
      const count = frequencyMap.get(topic) || 0;
      frequencyMap.set(topic, count + 1);
    });

    // Count meaningful words from description
    const words = extractMeaningfulWords(repo.description);
    words.forEach((word) => {
      const count = frequencyMap.get(word) || 0;
      frequencyMap.set(word, count + 1);
    });
  });

  // Sort by frequency and return top 8
  return Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

/**
 * Search for GitHub repositories and extract variables.
 *
 * Calls https://api.github.com/search/repositories directly from the browser,
 * parses the results, and extracts recurring topics and keywords.
 *
 * @param query - A free-text project idea description
 * @returns A promise resolving to { repos, variables }
 * @throws Error if the GitHub API returns an error (e.g., rate limit)
 */
export async function searchIdeas(query: string): Promise<SearchResponse> {
  // Extract 5 meaningful query words (4+ chars, excluding query stop words)
  const queryWords = extractQueryWords(query);
  if (queryWords.length === 0) {
    throw new Error("Search query too vague — please include meaningful terms");
  }

  const searchQuery =
    queryWords.slice(0, 5).join(" ") + " in:name,description,topics";
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=6`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        // Intentionally NO Authorization header
      },
    });

    if (response.status === 403) {
      console.error(`GitHub API rate limit (403): ${url}`);
      throw new Error(
        "GitHub API rate limit reached — wait a minute and try again.",
      );
    }

    if (!response.ok) {
      console.error(`Search failed (${response.status}): ${url}`);
      throw new Error(`Search failed: ${response.status}`);
    }

    const data: GitHubSearchResponse = await response.json();

    // Map GitHub API response to RepoResult shape
    const repos: RepoResult[] = data.items.map((item) => ({
      name: item.full_name,
      description: item.description || "",
      url: item.html_url,
      topics: item.topics || [],
      stars: item.stargazers_count,
    }));

    // Extract variables from repos
    const variables = extractVariables(repos);

    return { repos, variables };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(`Network error for URL: ${url}`);
    throw new Error("Network error — check your connection and try again");
  }
}
