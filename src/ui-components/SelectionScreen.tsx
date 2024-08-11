import { Accordion, AccordionItem, Box, LoadingIndicator, Swatch, Text } from "@canva/app-ui-kit";
import type { SelectionEvent } from "@canva/preview/design";
import { selection } from "@canva/preview/design";
import { useAction } from "convex/react";
import React, { useEffect, useState } from "react";
import type { TextAnalysisData } from "src/types/AnalysisData";
import { cleanText } from "src/utils/cleanText";
import { convertSuggestionType } from "src/utils/convertSuggestionType";
import { convertTextAnalysisDataType } from "src/utils/convertTextAnalysisDataType";
import { mapTextRegionToTextData } from "src/utils/mapTextRegionToTextData";
import { api } from "../../convex/_generated/api";
import { Suggestion, SuggestionType } from "../types/Suggestion";
import { SuggestionTab } from "./SuggestionTab";
import { SuggestionTabContainer } from "./SuggestionTabContainer";
import { SuggestionTabMedia } from "./SuggestionTabMedia";
import { SuggestionTabPalette } from "./SuggestionTabPalette";
import axios from "axios";
import { DesignInputName } from "src/types/Convex";

export const SelectionScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[] | undefined>(undefined);
  const [suggestedImageUrl, setSuggestedImageUrl] = useState("");

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

  const generateSuggestions = useAction(api.actions.generateSuggestions);

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

      /** Use convex to generate instant suggestions */
      const designInput = convertTextAnalysisDataType(analysisData);
      const generatedSuggestions = await generateSuggestions({
        designs: designInput,
      });

      setSuggestions(convertSuggestionType(generatedSuggestions));
      setIsLoading(false);

      /** Use convex to generate image based on design text */
      const convexDeploymentUrl = process.env.CONVEX_URL;
      const convexSiteUrl =
        convexDeploymentUrl && convexDeploymentUrl.endsWith(".cloud")
          ? convexDeploymentUrl.substring(0, convexDeploymentUrl.length - ".cloud".length) + ".site"
          : convexDeploymentUrl;

      const prompt = `an image relating to these keywords: ${designInput.components
        .filter(({ name }) => name === DesignInputName.Text)
        .map(({ props }) => (props.length === 1 && props[0].key === "text" ? props[0].value : ""))
        .toString()}`;

      const result = await axios.post(
        `${convexSiteUrl}/api/templates`,
        {
          prompt: prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (result.status === 200) {
        setSuggestedImageUrl(result.data.url);
      }
    }
  };

  useEffect(() => {
    getAnalysisData();
    if (!currentRichTextSelection || currentRichTextSelection.count === 0) {
      setSelectionCount(0);
      setSuggestions(undefined);
    }
  }, [currentRichTextSelection]);

  const noSelectionText = "Please make a selection on your design";
  const noSelectionBox = (
    <Box padding="8u" height="full">
      <Text alignment="center">{noSelectionText}</Text>
    </Box>
  );

  const wordingSuggestions = suggestions?.filter(
    (suggestion) => suggestion.type !== SuggestionType.Palette
  );

  const paletteSuggestions = suggestions?.filter(
    (suggestion) => suggestion.type === SuggestionType.Palette
  );

  const textElement =
    wordingSuggestions === undefined ? (
      noSelectionBox
    ) : (
      <SuggestionTab data={wordingSuggestions} action={replaceCurrentTextSelection} />
    );

  const mediaElement =
    suggestions === undefined ? noSelectionBox : <SuggestionTabMedia url={suggestedImageUrl} />;
  const colorElement =
    paletteSuggestions === undefined ? (
      noSelectionBox
    ) : (
      <SuggestionTabPalette suggestions={paletteSuggestions} />
    );

  return isLoading ? (
    <Box padding="12u">
      <LoadingIndicator size="large" />
    </Box>
  ) : (
    <SuggestionTabContainer
      allElement={
        <Accordion>
          <AccordionItem title="Wording suggestion">{textElement}</AccordionItem>
          <AccordionItem title="Media suggestion">{mediaElement}</AccordionItem>
          <AccordionItem title="Color suggestion">{colorElement}</AccordionItem>
        </Accordion>
      }
      textElement={textElement}
      mediaElement={mediaElement}
      colorElement={colorElement}
    />
  );
};
