import { MutationMode } from "../lib/mutate";

interface MutationModesProps {
  selectedMode: MutationMode;
  onModeChange: (mode: MutationMode) => void;
}

const modeDescriptions: Record<MutationMode, string> = {
  "domain-swap": "Replace one domain/context with another",
  invert: "Reverse the logic or flip the constraint",
  combine: "Merge two variables into a hybrid idea",
  extreme: "Scale the idea up dramatically or simplify down",
  minus: "Remove a key constraint or feature",
};

const modes: MutationMode[] = [
  "domain-swap",
  "invert",
  "combine",
  "extreme",
  "minus",
];

/**
 * MutationModes Component
 * Allows users to select which mutation mode to apply.
 */
export default function MutationModes({
  selectedMode,
  onModeChange,
}: MutationModesProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold mb-3 text-gray-700">Mutation Mode</h3>
      <div className="space-y-2">
        {modes.map((mode) => (
          <label key={mode} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="mutationMode"
              value={mode}
              checked={selectedMode === mode}
              onChange={() => onModeChange(mode)}
              className="w-4 h-4"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-800 capitalize">
                {mode.replace("-", " ")}
              </div>
              <div className="text-sm text-gray-600">
                {modeDescriptions[mode]}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
