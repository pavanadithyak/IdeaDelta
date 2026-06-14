import { useState, useEffect } from "react";
import { searchIdeas } from "./lib/api";
import { generateAllMutations, MutationMode } from "./lib/mutate";
import { RepoResult, ToggleState, Idea } from "./types";
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
 * and mutation workflow with a phone mockup interface.
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

      // Initialize toggle state (all variables off by default)
      const newToggleState: ToggleState = {};
      response.variables.forEach((v) => {
        newToggleState[v] = false;
      });
      setToggleState(newToggleState);

      // Generate initial mutations
      const mutations = generateAllMutations(
        query,
        response.variables,
        newToggleState,
      );
      setMutatedIdeas(mutations);

      // Expand overlay to show results
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

    // Regenerate all mutations with new toggle state
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
    <div className="fixed inset-0 flex flex-col items-center justify-between overflow-hidden z-10">
      {/* Aurora background */}
      <AuroraBackground />

      {/* Title and tagline - positioned above phone */}
      <div
        className={`relative z-20 pt-12 text-center transition-opacity duration-300 ${
          isExpanded ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-5xl font-space-grotesk tracking-tight font-semibold mb-2 text-white">
          IdeaDelta
        </h1>
        <p className="text-sm text-white/60">
          Describe an idea. See what already exists. Build what doesn't.
        </p>
      </div>

      {/* Phone mockup - positioned at bottom or center based on expanded state */}
      <div className="relative z-20 flex-1 w-full">
        <PhoneFrame isExpanded={isExpanded} onClose={handleClose}>
          {!isExpanded ? (
            // Resting state: just search bar
            <div>
              <IdeaInput
                onSearch={handleSearch}
                isLoading={isLoading}
                setIsExpanded={setIsExpanded}
              />
            </div>
          ) : (
            // Expanded state: search bar + results
            <div className="space-y-6 max-h-[85vh] overflow-y-auto">
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
                          <IdeaCard idea={idea} />
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
