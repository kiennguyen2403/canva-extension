import { FontWeight } from "@canva/preview/design";

export interface TextData {
  id: number;
  formatting?: {
    color?: string;
    underline?: boolean;
    fontName?: string;
    fontSize?: number;
    italic?: boolean;
    fontWeight?: FontWeight;
    link?: string;
    listLevel?: number;
    listMarker?:
      | "none"
      | "disc"
      | "circle"
      | "square"
      | "decimal"
      | "lower-alpha"
      | "lower-roman"
      | "checked"
      | "unchecked";
    strikethrough?: boolean;
    textAlign?: "start" | "center" | "end" | "justify";
  };
  text: string;
}

export interface TextAnalysisData {
  styles: TextData[];
  fullText: string;
  rawFullText: string;
}

export interface ImageData {
  imageUrl: string;
}
