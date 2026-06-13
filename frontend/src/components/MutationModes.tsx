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
 * Allows users to select which mutation mode with glassmorphic styling.
 */
export default function MutationModes({
  selectedMode,
  onModeChange,
}: MutationModesProps) {
  return (
    <div>
      <h3 className="font-bold mb-3 text-white">Mutation Mode</h3>
      <div className="space-y-2">
        {modes.map((mode) => (
          <label
            key={mode}
            className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/10 hover:bg-white/[0.08] transition-all duration-200"
          >
            <input
              type="radio"
              name="mutationMode"
              value={mode}
              checked={selectedMode === mode}
              onChange={() => onModeChange(mode)}
              className="w-4 h-4 accent-white/80"
            />
            <div className="flex-1">
              <div className="font-medium text-white capitalize">
                {mode.replace("-", " ")}
              </div>
              <div className="text-sm text-white/60">
                {modeDescriptions[mode]}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
