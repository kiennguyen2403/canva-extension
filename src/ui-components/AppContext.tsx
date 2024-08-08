import React from "react";
import { AppScreenType } from "src/types/Screen";

export interface AppSuggestionData {
  feedbacks: string[];
  grade: {
    contentGrade: number;
    fontGrade: number;
    overall: number;
    paletteGrade: number;
    syntaxAndCorrectness: string;
  };
  recommendations: string[];
}

export type AppContextData = string | AppSuggestionData | undefined;

export interface AppContextType {
  screen: AppScreenType;
  setScreen: (screen: AppScreenType) => void;
  data: AppContextData;
  setData: (data: AppContextData) => void;
}
export const nullAppContext: AppContextType = {
  screen: AppScreenType.SelectionSuggestionScreen,
  setScreen: () => {},
  data: "",
  setData: () => {},
};
export const AppContext = React.createContext(nullAppContext);
