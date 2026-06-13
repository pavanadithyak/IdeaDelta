import { Idea } from "../types";

/**
 * Idea generation templates.
 * These templates are used to generate consistent, structured ideas
 * for different mutation modes.
 */

export interface IdeaTemplate {
  name: (baseIdea: string, variables: string[]) => string;
  tagline: (baseIdea: string, variables: string[]) => string;
  description: (baseIdea: string, variables: string[]) => string;
  keywords: (baseIdea: string, variables: string[]) => string[];
  copilotPrompt: (idea: Idea) => string;
}

/**
 * Domain Swap Template: Replace one domain/context with another
 */
export const domainSwapTemplate: IdeaTemplate = {
  name: (baseIdea: string, variables: string[]) => {
    const newDomain = variables[0] || "platform";
    return `${baseIdea} for ${newDomain}`;
  },
  tagline: (baseIdea: string, variables: string[]) => {
    const newDomain = variables[0] || "the modern era";
    return `Reimagining ${baseIdea.toLowerCase()} in the ${newDomain} context`;
  },
  description: (baseIdea: string, variables: string[]) => {
    const domains = variables.slice(0, 2).join(" and ");
    return `A fresh take on ${baseIdea.toLowerCase()}, tailored for ${domains}. Combines proven patterns from existing solutions with domain-specific optimizations.`;
  },
  keywords: (_baseIdea: string, variables: string[]) => {
    return variables.slice(0, 3);
  },
  copilotPrompt: (idea: Idea) => {
    return `Build a project called "${idea.name}". ${idea.description} The project should focus on these aspects: ${idea.keywords.join(", ")}. Tagline: "${idea.tagline}"`;
  },
};

/**
 * Invert Template: Reverse the logic or flip the constraint
 */
export const invertTemplate: IdeaTemplate = {
  name: (baseIdea: string, _variables: string[]) => {
    return `Anti-${baseIdea}`;
  },
  tagline: (baseIdea: string, _variables: string[]) => {
    return `What if ${baseIdea.toLowerCase()} did the opposite?`;
  },
  description: (baseIdea: string, variables: string[]) => {
    const constraint = variables[0] || "simplicity";
    return `Flips the conventional approach to ${baseIdea.toLowerCase()}. Instead of optimizing for ${constraint}, prioritizes ${variables[1] || "accessibility"}. Explores the untapped potential of the inverse direction.`;
  },
  keywords: (_baseIdea: string, variables: string[]) => {
    return ["inversion", "unconventional", ...variables.slice(0, 2)];
  },
  copilotPrompt: (idea: Idea) => {
    return `Build a project called "${idea.name}". ${idea.description} The key is to think opposite to traditional approaches. Emphasize: ${idea.keywords.join(", ")}. Tagline: "${idea.tagline}"`;
  },
};

/**
 * Combine Template: Merge two variables into a hybrid idea
 */
export const combineTemplate: IdeaTemplate = {
  name: (_baseIdea: string, variables: string[]) => {
    const var1 = variables[0] || "A";
    const var2 = variables[1] || "B";
    return `${var1}${var2}`;
  },
  tagline: (_baseIdea: string, variables: string[]) => {
    const var1 = variables[0] || "concept A";
    const var2 = variables[1] || "concept B";
    return `${var1} meets ${var2}`;
  },
  description: (_baseIdea: string, variables: string[]) => {
    const var1 = variables[0] || "first concept";
    const var2 = variables[1] || "second concept";
    return `A hybrid fusion of ${var1} and ${var2}. Combines the best practices of both domains to create a novel tool that leverages the strengths of each. Perfect for users seeking an integrated solution.`;
  },
  keywords: (_baseIdea: string, variables: string[]) => {
    return ["hybrid", "fusion", ...variables.slice(0, 3)];
  },
  copilotPrompt: (idea: Idea) => {
    return `Build a project called "${idea.name}". ${idea.description} Integrate and balance these elements: ${idea.keywords.join(", ")}. Tagline: "${idea.tagline}"`;
  },
};

/**
 * Extreme Template: Scale up dramatically or simplify down
 */
export const extremeTemplate: IdeaTemplate = {
  name: (baseIdea: string, _variables: string[]) => {
    return `${baseIdea} Extreme`;
  },
  tagline: (baseIdea: string, _variables: string[]) => {
    return `${baseIdea.toUpperCase()} at scale`;
  },
  description: (baseIdea: string, variables: string[]) => {
    const capability = variables[0] || "capability";
    return `Pushes ${baseIdea.toLowerCase()} to its limits. Designed for extreme scenarios where ${capability} and ${variables[1] || "performance"} are non-negotiable. Scales dramatically while maintaining reliability.`;
  },
  keywords: (_baseIdea: string, variables: string[]) => {
    return ["extreme", "scale", "performance", ...variables.slice(0, 2)];
  },
  copilotPrompt: (idea: Idea) => {
    return `Build an extreme version of "${idea.name}". ${idea.description} Prioritize scalability and performance above all. Key focus: ${idea.keywords.join(", ")}. Tagline: "${idea.tagline}"`;
  },
};

/**
 * Minus Template: Remove a key constraint or feature
 */
export const minusTemplate: IdeaTemplate = {
  name: (baseIdea: string, variables: string[]) => {
    const removed = variables[0] || "constraint";
    return `${baseIdea} Without ${removed}`;
  },
  tagline: (baseIdea: string, _variables: string[]) => {
    return `${baseIdea} distilled to its essence`;
  },
  description: (baseIdea: string, variables: string[]) => {
    const removed = variables[0] || "unnecessary complexity";
    return `A minimalist version of ${baseIdea.toLowerCase()}. Strips away ${removed} to reveal the core value. Perfect for users who want simplicity without compromise.`;
  },
  keywords: (_baseIdea: string, variables: string[]) => {
    return ["minimal", "essential", "focused", ...variables.slice(1, 3)];
  },
  copilotPrompt: (idea: Idea) => {
    return `Build a minimal, focused version of "${idea.name}". ${idea.description} Keep only the essentials. Focus on: ${idea.keywords.join(", ")}. Tagline: "${idea.tagline}"`;
  },
};

export const templates = {
  "domain-swap": domainSwapTemplate,
  invert: invertTemplate,
  combine: combineTemplate,
  extreme: extremeTemplate,
  minus: minusTemplate,
};
