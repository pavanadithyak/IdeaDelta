import { Idea, ToggleState } from "../types";
import { templates, IdeaTemplate } from "./templates";

/**
 * Mutation modes for idea transformation.
 */
export type MutationMode =
  | "domain-swap"
  | "invert"
  | "combine"
  | "extreme"
  | "minus";

/**
 * Apply a mutation mode to generate a new idea.
 *
 * @param baseIdea - The original idea text
 * @param allVariables - All extracted variables
 * @param toggleState - Which variables are selected/toggled on
 * @param mode - The mutation mode to apply
 * @returns A new mutated Idea object
 */
export function mutateIdea(
  baseIdea: string,
  allVariables: string[],
  toggleState: ToggleState,
  mode: MutationMode,
): Idea {
  // Get selected variables (toggled on)
  const selectedVariables = Object.entries(toggleState)
    .filter(([_, isSelected]) => isSelected)
    .map(([variable]) => variable);

  // If no variables selected, use top ones
  const variablesToUse =
    selectedVariables.length > 0 ? selectedVariables : allVariables.slice(0, 3);

  // Get the appropriate template
  const template: IdeaTemplate = templates[mode];

  if (!template) {
    throw new Error(`Unknown mutation mode: ${mode}`);
  }

  // Generate the idea using the template
  const idea: Idea = {
    name: template.name(baseIdea, variablesToUse),
    tagline: template.tagline(baseIdea, variablesToUse),
    description: template.description(baseIdea, variablesToUse),
    keywords: template.keywords(baseIdea, variablesToUse),
    copilotPrompt: "", // Set below
  };

  idea.copilotPrompt = template.copilotPrompt(idea);

  return idea;
}

/**
 * Generate all five mutation variants of an idea.
 *
 * @param baseIdea - The original idea text
 * @param allVariables - All extracted variables
 * @param toggleState - Which variables are selected/toggled on
 * @returns An array of five mutated ideas, one per mode
 */
export function generateAllMutations(
  baseIdea: string,
  allVariables: string[],
  toggleState: ToggleState,
): Record<MutationMode, Idea> {
  const modes: MutationMode[] = [
    "domain-swap",
    "invert",
    "combine",
    "extreme",
    "minus",
  ];

  return modes.reduce(
    (acc, mode) => {
      acc[mode] = mutateIdea(baseIdea, allVariables, toggleState, mode);
      return acc;
    },
    {} as Record<MutationMode, Idea>,
  );
}
