import {
  Tabs,
  Tab,
  TabList,
  TabPanel,
  LoadingIndicator,
  Box,
  TabPanels,
  Rows,
  Text,
} from "@canva/app-ui-kit";
import React, { useEffect, useMemo, useState } from "react";
import { SuggestionTabText } from "./SuggestionTabText";
import { Suggestion, SuggestionText } from "../types/Suggestion";
import { useSelection } from "utils/use_selection_hook";
import { TextContentDraft } from "src/types/Draft";

export const AppScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const currentTextSelection = useSelection("plaintext");
  const [currentTextDraft, setCurrentTextDraft] = useState<TextContentDraft | undefined>(undefined);

  const readCurrentTextSelection = async () => {
    const draft = await currentTextSelection.read();
    setCurrentTextDraft(draft);
  };

  const replaceCurrentTextSelection = async ({
    id,
    original,
    suggested,
  }: {
    id: number;
    original: string;
    suggested: string;
  }) => {
    if (currentTextDraft && id < currentTextDraft.contents.length) {
      const draft = await currentTextSelection.read();
      const content = draft.contents[id];
      content.text === suggested ? (content.text = original) : (content.text = suggested);
      await draft.save();
    }
  };

  useEffect(() => {
    // Read contents on design
    readCurrentTextSelection();
  }, [currentTextSelection]);

  const data = useMemo<Suggestion | undefined>(() => {
    if (currentTextSelection.count > 0 && currentTextDraft) {
      console.log("call backend");

      setIsLoading(true);

      //TODO: fetching data from backend
      const grammarSuggestions: SuggestionText[] = currentTextDraft.contents.map((content) => {
        return {
          suggestion: `Do you mean 'Hello World'?`,
          suggested: "Hello World",
          original: content.text,
        };
      });
      setIsLoading(false);

      return {
        text: grammarSuggestions,
        media: [],
        color: {
          current: [],
          suggested: [],
        },
      };
    }

    return undefined;
  }, [currentTextSelection, currentTextDraft]);

  const isDataEmpty = !data || (data && Object.keys(data).length === 0);

  const noSelectionText = "Please make a selection on your design";
  const noSelectionBox = (
    <Box padding="8u" height="full">
      <Text alignment="center">{noSelectionText}</Text>
    </Box>
  );

  return isLoading ? (
    <Box padding="12u">
      <LoadingIndicator size="large" />
    </Box>
  ) : (
    <Tabs height="fill">
      <Rows spacing="2u">
        <TabList>
          <Tab id="all">All</Tab>
          <Tab id="text">Wording</Tab>
          <Tab id="media">Media</Tab>
          <Tab id="color">Color</Tab>
        </TabList>
        <TabPanels>
          <TabPanel id="all">Lorem ipsum</TabPanel>
          <TabPanel id="text">
            {isDataEmpty ? (
              noSelectionBox
            ) : (
              <SuggestionTabText data={data.text} action={replaceCurrentTextSelection} />
            )}
          </TabPanel>
          <TabPanel id="media"></TabPanel>
          <TabPanel id="color"></TabPanel>
        </TabPanels>
      </Rows>
    </Tabs>
  );
};
