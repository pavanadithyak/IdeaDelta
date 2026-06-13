import { ToggleState } from "../types";

interface VariableToggleProps {
  variables: string[];
  toggleState: ToggleState;
  onToggle: (variable: string) => void;
}

/**
 * VariableToggle Component
 * Allows users to select/deselect variables with glassmorphic styling.
 */
export default function VariableToggle({
  variables,
  toggleState,
  onToggle,
}: VariableToggleProps) {
  if (variables.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-bold mb-3 text-white">Variables (click to toggle)</h3>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <button
            key={variable}
            onClick={() => onToggle(variable)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 backdrop-blur-md border ${
              toggleState[variable]
                ? "bg-white/[0.15] border-white/30 text-white"
                : "bg-white/[0.05] border-white/10 text-white/70 hover:bg-white/[0.1]"
            }`}
          >
            {variable}
          </button>
        ))}
      </div>
    </div>
  );
}
