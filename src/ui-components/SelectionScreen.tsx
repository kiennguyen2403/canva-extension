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
import React, { useEffect, useState } from "react";
import { SuggestionTab } from "./SuggestionTab";
import { Suggestion, SuggestionType } from "../types/Suggestion";
import { useSelection } from "utils/use_selection_hook";
import { RichTextContentDraft, TextContentDraft } from "src/types/Draft";
import type { SelectionEvent } from "@canva/preview/design";
import { selection } from "@canva/preview/design";
import { cleanText } from "src/utils/cleanText";
import { mapTextRegionToTextData } from "src/utils/mapTextRegionToTextData";
import type { TextAnalysisData } from "src/types/AnalysisData";
import { SuggestionTabContainer } from "./SuggestionTabContainer";

export const SelectionScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  /**
   * Richtext is currently in preview, may have huge changes later
   * Plain text API is currently commented out and Richtext is used
   */

  // const currentTextSelection = useSelection("plaintext");
  // const [currentTextDraft, setCurrentTextDraft] = useState<TextContentDraft | undefined>(undefined);

  const [currentRichTextSelection, setCurrentRichTextSelection] =
    useState<SelectionEvent<"richtext">>();

  const [selectionCount, setSelectionCount] = useState(0);
  useEffect(() => {
    return selection.registerOnChange({
      scope: "richtext",
      onChange: setCurrentRichTextSelection,
    });
  }, []);

  const replaceCurrentTextSelection = async ({
    id,
    original,
    suggested,
  }: {
    id: number;
    original: string;
    suggested: string;
  }) => {
    // if (currentTextDraft && id < currentTextDraft.contents.length) {
    //   const draft = await currentTextSelection.read();
    //   const content = draft.contents[id];
    //   content.text === suggested ? (content.text = original) : (content.text = suggested);
    //   await draft.save();
    // }

    if (currentRichTextSelection && currentRichTextSelection.count > 0) {
      const draft = await currentRichTextSelection.read();
      const content = draft.contents[id];
      const contentText = await content.readPlaintext();
      if (contentText === original) {
        content.replaceText({ index: 0, length: contentText.length }, suggested);
      } else if (contentText === suggested) {
        content.replaceText({ index: 0, length: contentText.length }, original);
      }
      setSelectionCount(currentRichTextSelection.count);
      await draft.save();
    }
  };

  const getAnalysisData = async () => {
    if (
      currentRichTextSelection &&
      currentRichTextSelection.count > 0 &&
      currentRichTextSelection.count !== selectionCount
    ) {
      const draft = await currentRichTextSelection.read();

      setIsLoading(true);

      /** Gather analysis data */
      const analysisData: TextAnalysisData[] = [];

      for (const content of draft.contents) {
        let datum: TextAnalysisData = {
          fullText: "",
          rawFullText: "",
          styles: [],
        };
        const regions = await content.readTextRegions();
        const fullText = await content.readPlaintext();
        datum.fullText = cleanText(fullText);
        datum.rawFullText = fullText;

        for (let i = 0; i < regions.length; i++) {
          datum.styles.push(await mapTextRegionToTextData({ id: i, data: regions[i] }));
        }
        analysisData.push(datum);
      }
      /** TODO: calling backend */
      console.log("call backend");

      /** Dummy data suggestion */
      const fakeSuggestions: Suggestion[] = [];
      // Suggestion with no comments
      fakeSuggestions.push({
        suggestion: "",
        type: SuggestionType.NoSuggestion,
        errors: [],
      });
      // Suggestion with grammar errors
      for (let i = 0; i < analysisData.length; i++) {
        if (analysisData[i].fullText === "Hello Worl") {
          fakeSuggestions.push({
            suggestion: `Do you mean 'Hello World'?`,
            suggested: { ...analysisData[i], fullText: "Hello World", rawFullText: "Hello\nWorld" },
            type: SuggestionType.Grammar,
            original: analysisData[i],
            errors: ["Grammar error"],
          });
        }
      }

      setSuggestions(fakeSuggestions);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnalysisData();
    if (!currentRichTextSelection || currentRichTextSelection.count === 0) {
      setSelectionCount(0);
      setSuggestions([]);
    }
  }, [currentRichTextSelection]);

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
    <SuggestionTabContainer>
      {suggestions.length === 0 ? (
        noSelectionBox
      ) : (
        <SuggestionTab data={suggestions} action={replaceCurrentTextSelection} />
      )}
    </SuggestionTabContainer>
  );
};
