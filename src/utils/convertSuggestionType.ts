import { Suggestion as ConvexSuggestion } from "convex/type/types";
import { SuggestionType, Suggestion } from "src/types/Suggestion";

export const convertSuggestionType = (suggestions: ConvexSuggestion[]): Suggestion[] => {
  const result: Suggestion[] = [];
  suggestions.forEach(({ title, type, content, extra }) => {
    if (type !== "warning") {
      return;
    }
    result.push({
      suggestion: content,
      type: title,
    });
  });
  return result;
};
