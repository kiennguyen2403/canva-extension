import type { TextAnalysisData } from "./AnalysisData";

export interface Suggestion {
  suggestion: string;
  suggested?: TextAnalysisData;
  original?: TextAnalysisData;
  type: string; // TODO: change to type: SuggestionType; when types are finalised
  errors: string[];
}

export interface DataExport {
  score: number;
  suggestions: Suggestion[];
}

export enum SuggestionType {
  General = "General",
  Grammar = "Grammar",
  TextStyle = "TextStyle",
  Palette = "Palette",
  NoSuggestion = "NoSuggestion",
}
