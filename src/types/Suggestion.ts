export interface Suggestion {
  text: SuggestionText[];
  media: SuggestionMedia[];
  color: SuggestionColor;
}

export interface SuggestionText {
  suggestion: string;
  suggested?: string;
  original?: string;
}

export interface SuggestionMedia {
  url: string;
  description?: string;
}

export interface SuggestionColor {
  current: PalleteColor[];
  suggested: PalleteColor[];
}

export interface PalleteColor {
  color: string;
}
