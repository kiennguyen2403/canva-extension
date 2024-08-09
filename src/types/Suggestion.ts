import type { TextAnalysisData } from "./AnalysisData";

export interface Suggestion {
  suggestion: string;
  suggested?: TextAnalysisData;
  original?: TextAnalysisData;
  type: string; // TODO: change to type: SuggestionType; when types are finalised
}

export interface DataExport {
  score: number;
  suggestions: Suggestion[];
}

export enum SuggestionType {
  General = "General",
  Grammar = "Grammar",
  Palette = "Palette",
  Content = "Content",
  Font = "Font",
  NoSuggestion = "NoSuggestion",
}
