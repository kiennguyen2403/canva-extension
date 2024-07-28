import type { TextAnalysisData } from "./AnalysisData";

export interface Suggestion {
  suggestion: string;
  suggested?: TextAnalysisData;
  original?: TextAnalysisData;
  type: SuggestionType;
  errors: string[];
}

export interface DataExport {
  score: number;
  suggestions: Suggestion[];
}

export enum SuggestionType {
  General,
  Grammar,
  TextStyle,
  Palette,
  NoSuggestion
}
