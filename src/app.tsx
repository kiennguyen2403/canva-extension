import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import * as React from "react";
import { useState } from "react";
import { AppLayout } from "./ui-components/AppLayout";
import { SelectionScreen } from "./ui-components/SelectionScreen";
import { AppScreenType } from "./types/Screen";
import { FullSuggestionScreen } from "./ui-components/FullSuggestionScreen";

const renderScreen = (screen: AppScreenType) => {
  switch (screen) {
    case AppScreenType.MainScreen:
      return <></>;
    case AppScreenType.FullSuggestionScreen:
      return <FullSuggestionScreen />;
    case AppScreenType.SelectionSuggestionScreen:
      return <SelectionScreen />;
    default:
      return <></>;
  }
};

export const App = () => {
  const [screen, setScreen] = useState<AppScreenType>(AppScreenType.SelectionSuggestionScreen);

  return (
    <AppLayout screen={screen} setScreen={setScreen}>
      {renderScreen(screen)}
    </AppLayout>
  );
};
