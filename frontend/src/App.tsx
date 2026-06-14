import { useState, useEffect } from "react";
import { searchIdeas } from "./lib/api";
import { generateAllMutations, MutationMode } from "./lib/mutate";
import { RepoResult, ToggleState, Idea } from "./types";
import { useIdeaHistory } from "./hooks/useIdeaHistory";
import AuroraBackground from "./components/AuroraBackground";
import PhoneFrame from "./components/PhoneFrame";
import IdeaInput from "./components/IdeaInput";
import RepoRadar from "./components/RepoRadar";
import VariableToggle from "./components/VariableToggle";
import MutationModes from "./components/MutationModes";
import IdeaCard from "./components/IdeaCard";

/**
 * App Component
 * Main application orchestrating the idea search, variable extraction,
 * and mutation workflow with a top-to-bottom hero + phone layout.
 */
export default function App() {
  // UI state
  const [isExpanded, setIsExpanded] = useState(false);

  // Search state
  const [baseIdea, setBaseIdea] = useState("");
  const [repos, setRepos] = useState<RepoResult[]>([]);
  const [variables, setVariables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Mutation state
  const [toggleState, setToggleState] = useState<ToggleState>({});
  const [selectedMode, setSelectedMode] = useState<MutationMode>("domain-swap");
  const [mutatedIdeas, setMutatedIdeas] = useState<
    Partial<Record<MutationMode, Idea>>
  >({});

  // History
  const { history, addToHistory, clearHistory } = useIdeaHistory();

  // Novelty score derived from repos
  const noveltyScore =
    repos.length > 0
      ? Math.max(
          10,
          Math.min(
            99,
            100 -
              repos.length * 10 -
              Math.log10(
                repos.reduce((sum, r) => sum + r.stars, 1),
              ) *
                8,
          ),
        )
      : 0;

  // Auto-search from URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      handleSearch(q);
    }
  }, []);

  // Handle Escape key to collapse
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  /**
   * Close the expanded phone view and reset results
   */
  const handleClose = () => {
    setIsExpanded(false);
    setRepos([]);
    setVariables([]);
    setMutatedIdeas({} as Partial<Record<MutationMode, Idea>>);
    setBaseIdea("");
    setError("");
    setToggleState({});
  };

  /**
   * Handle search: fetch repos and variables from GitHub
   */
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError("");
    setBaseIdea(query);

    try {
      const response = await searchIdeas(query);
      setRepos(response.repos);
      setVariables(response.variables);

      const newToggleState: ToggleState = {};
      response.variables.forEach((v) => {
        newToggleState[v] = false;
      });
      setToggleState(newToggleState);

      const mutations = generateAllMutations(
        query,
        response.variables,
        newToggleState,
      );
      setMutatedIdeas(mutations);

      addToHistory(query);
      window.history.pushState({}, "", `?q=${encodeURIComponent(query)}`);
      setIsExpanded(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setRepos([]);
      setVariables([]);
      setMutatedIdeas({} as Partial<Record<MutationMode, Idea>>);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle variable toggle and regenerate mutations
   */
  const handleToggleVariable = (variable: string) => {
    const newToggleState = {
      ...toggleState,
      [variable]: !toggleState[variable],
    };
    setToggleState(newToggleState);

    const mutations = generateAllMutations(baseIdea, variables, newToggleState);
    setMutatedIdeas(mutations);
  };

  /**
   * Handle mutation mode change
   */
  const handleModeChange = (mode: MutationMode) => {
    setSelectedMode(mode);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden z-10">
      {/* Aurora background */}
      <AuroraBackground />

      {/* Hero Section */}
      <div
        className={`relative z-20 flex flex-col items-center justify-center min-h-[50vh] pt-16 transition-opacity duration-500 ${
          isExpanded ? "opacity-30" : "opacity-100"
        }`}
      >
        <h1 className="text-6xl font-space-grotesk tracking-tight font-semibold text-white">
          IdeaDelta
        </h1>
        <p className="text-lg text-white/60 mt-2">
          Describe an idea. See what already exists. Build what doesn't.
        </p>
        <div className="flex gap-3 mt-6 justify-center">
          <span className="bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-xs px-4 py-1.5 rounded-full">
            ⚡ GitHub-powered scan
          </span>
          <span className="bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-xs px-4 py-1.5 rounded-full">
            🧬 5 mutation modes
          </span>
          <span className="bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-xs px-4 py-1.5 rounded-full">
            🤖 Copilot-ready prompts
          </span>
        </div>
        <div className="mt-8 animate-bounce">
          <svg
            className="w-6 h-6 text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Phone Section */}
      <div className="relative z-20 flex-1">
        <PhoneFrame isExpanded={isExpanded} onClose={handleClose}>
          {!isExpanded ? (
            // Resting state: search bar + recent history
            <div className="space-y-3">
              <IdeaInput
                onSearch={handleSearch}
                isLoading={isLoading}
                setIsExpanded={setIsExpanded}
              />
              {history.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">
                    Recent
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {history.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          handleSearch(item);
                          setIsExpanded(true);
                        }}
                        className="text-xs text-white/60 bg-white/5 border border-white/10 px-3 py-1 rounded-full cursor-pointer hover:bg-white/15 transition-all"
                      >
                        {item.length > 20
                          ? item.slice(0, 20) + "…"
                          : item}
                      </button>
                    ))}
                    <button
                      onClick={clearHistory}
                      className="text-xs text-white/40 hover:text-white/60 px-1.5"
                      title="Clear history"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Expanded state: search bar + results
            <div className="space-y-6">
              {/* Search bar at top */}
              <IdeaInput
                onSearch={handleSearch}
                isLoading={isLoading}
                setIsExpanded={setIsExpanded}
              />

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-900/30 text-red-100 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              {/* Results sections */}
              {repos.length > 0 && (
                <>
                  {/* Similar Projects */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-white">
                      Similar Projects Found
                    </h2>
                    <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                      <RepoRadar repos={repos} />
                    </div>
                  </div>

                  {/* Variables Toggle */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-white">
                      Adjust Variables
                    </h2>
                    <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                      <VariableToggle
                        variables={variables}
                        toggleState={toggleState}
                        onToggle={handleToggleVariable}
                      />
                    </div>
                  </div>

                  {/* Mutation Modes */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-white">
                      Mutation Mode
                    </h2>
                    <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                      <MutationModes
                        selectedMode={selectedMode}
                        onModeChange={handleModeChange}
                      />
                    </div>
                  </div>

                  {/* Mutated Idea */}
                  {(() => {
                    const idea = mutatedIdeas[selectedMode];
                    if (!idea) return null;
                    return (
                      <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-white">
                          Your Mutated Idea
                        </h2>
                        <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                          <IdeaCard
                            idea={idea}
                            noveltyScore={noveltyScore}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}
        </PhoneFrame>
      </div>
    </div>
  );
}
