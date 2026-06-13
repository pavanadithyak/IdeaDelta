/**
 * Core types for the IdeaDelta application.
 */

export interface RepoResult {
  name: string;
  description: string;
  url: string;
  topics: string[];
  stars: number;
}

export interface SearchResponse {
  repos: RepoResult[];
  variables: string[];
}

export interface Idea {
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
  copilotPrompt: string;
}

export interface ToggleState {
  [variable: string]: boolean;
}
