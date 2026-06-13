import { useState } from "react";
import { searchIdeas } from "./lib/api";
import { generateAllMutations, MutationMode } from "./lib/mutate";
import { RepoResult, ToggleState, Idea } from "./types";
import IdeaInput from "./components/IdeaInput";
import RepoRadar from "./components/RepoRadar";
import VariableToggle from "./components/VariableToggle";
import MutationModes from "./components/MutationModes";
import IdeaCard from "./components/IdeaCard";

/**
 * App Component
 * Main application orchestrating the idea search, variable extraction,
 * and mutation workflow.
 */
export default function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">IdeaDelta</h1>
          <p className="text-xl text-gray-600">
            Describe an idea. See what already exists. Build what doesn't.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <IdeaInput onSearch={handleSearch} isLoading={isLoading} />
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {repos.length > 0 && (
          <>
            {/* Repo Radar */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Similar Projects Found
              </h2>
              <RepoRadar repos={repos} />
            </div>

            {/* Variables and Mutation Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VariableToggle
                variables={variables}
                toggleState={toggleState}
                onToggle={handleToggleVariable}
              />
              <MutationModes
                selectedMode={selectedMode}
                onModeChange={handleModeChange}
              />
            </div>

            {/* Mutated Ideas */}
            {(() => {
              const idea = mutatedIdeas[selectedMode];
              if (!idea) return null;
              return (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">
                    Your Mutated Idea
                  </h2>
                  <IdeaCard idea={idea} />
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}
