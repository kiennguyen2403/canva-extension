import { Suggestion as ConvexSuggestion } from "convex/type/types";
import { Suggestion } from "src/types/Suggestion";

export const convertSuggestionType = (suggestions: ConvexSuggestion[]): Suggestion[] => {
  return suggestions.map(({ title, type, content, extra }) => {
    console.log(`extra: ${extra}`);
    return {
      suggestion: title,
      suggested: {
        styles: [],
        fullText: content,
        rawFullText: content,
      },
      type,
      errors: [],
    };
  });
};
