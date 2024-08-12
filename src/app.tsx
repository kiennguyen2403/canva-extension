import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import * as React from "react";
import { useState } from "react";
import { AppLayout } from "./ui-components/AppLayout";
import { SelectionScreen } from "./ui-components/SelectionScreen";
import { AppScreenType } from "./types/Screen";
import { FullSuggestionScreen } from "./ui-components/FullSuggestionScreen";
import { ExportingScreen } from "./ui-components/ExportingScreen";
import { AppContext, AppContextData } from "./ui-components/AppContext";

const renderScreen = (screen: AppScreenType) => {
  switch (screen) {
    case AppScreenType.ExportingScreen:
      return <ExportingScreen />;
    case AppScreenType.FullSuggestionScreen:
      return <FullSuggestionScreen />;
    case AppScreenType.SelectionSuggestionScreen:
      return <SelectionScreen />;
    default:
      return <></>;
  }
};

export const App = () => {
  const [screen, setScreen] = useState<AppScreenType>(
    AppScreenType.SelectionSuggestionScreen
  );
  const [data, setData] = useState<AppContextData>(undefined);

  return (
    <AppContext.Provider value={{ screen, setScreen, data, setData }}>
      <AppLayout>{renderScreen(screen)}</AppLayout>
    </AppContext.Provider>
  );
};
