import { ToggleState } from "../types";

interface VariableToggleProps {
  variables: string[];
  toggleState: ToggleState;
  onToggle: (variable: string) => void;
}

/**
 * VariableToggle Component
 * Allows users to select/deselect variables that will be used in mutations.
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
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold mb-3 text-gray-700">
        Variables (click to toggle)
      </h3>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <button
            key={variable}
            onClick={() => onToggle(variable)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition ${
              toggleState[variable]
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {variable}
          </button>
        ))}
      </div>
    </div>
  );
}
