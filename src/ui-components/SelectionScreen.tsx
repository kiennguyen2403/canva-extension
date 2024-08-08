import {
  Accordion,
  AccordionItem,
  Box,
  ImageCard,
  LoadingIndicator,
  Masonry,
  MasonryItem,
  Rows,
  Swatch,
  Text,
} from "@canva/app-ui-kit";
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
import { Suggestion } from "../types/Suggestion";
import { SuggestionTab } from "./SuggestionTab";
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
      console.log("call backend");
      const generatedSuggestions = await generateSuggestions({
        designs: convertTextAnalysisDataType(analysisData),
      });

      setSuggestions(convertSuggestionType(generatedSuggestions));
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

  const CopySwatch = ({ color, label }: { color: string; label?: string }) => (
    <Swatch
      fill={[color]}
      onClick={() => {
        navigator.clipboard.writeText(color);
      }}
      size="xsmall"
      variant="solid"
      tooltipLabel={label}
    />
  );

  return isLoading ? (
    <Box padding="12u">
      <LoadingIndicator size="large" />
    </Box>
  ) : (
    <SuggestionTabContainer
      allElement={
        <Accordion defaultExpanded>
          <AccordionItem title="Wording suggestion">
            {suggestions.length === 0 ? (
              noSelectionText
            ) : (
              <SuggestionTab data={suggestions} action={replaceCurrentTextSelection} />
            )}
          </AccordionItem>
          <AccordionItem title="Media suggestion">
            <Text>Media suggestions</Text>
          </AccordionItem>
          <AccordionItem title="Color suggestion">
            <Text>Palette suggestions</Text>
          </AccordionItem>
        </Accordion>
      }
      textElement={
        suggestions.length === 0 ? (
          noSelectionBox
        ) : (
          <SuggestionTab data={suggestions} action={replaceCurrentTextSelection} />
        )
      }
      mediaElement={
        <>
          <Box paddingBottom="2u">
            <Text alignment="start" capitalization="default" size="medium" variant="bold">
              Suggested images for your design
            </Text>
          </Box>
          <Masonry targetRowHeightPx={100}>
            <MasonryItem targetHeightPx={100} targetWidthPx={106}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/106/100"
              />
            </MasonryItem>
            <MasonryItem targetHeightPx={100} targetWidthPx={54}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/54/100"
              />
            </MasonryItem>
            <MasonryItem targetHeightPx={100} targetWidthPx={185}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/185/100"
              />
            </MasonryItem>
            <MasonryItem targetHeightPx={100} targetWidthPx={167}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/167/100"
              />
            </MasonryItem>
            <MasonryItem targetHeightPx={100} targetWidthPx={114}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/114/100"
              />
            </MasonryItem>
            <MasonryItem targetHeightPx={100} targetWidthPx={133}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/133/100"
              />
            </MasonryItem>
            <MasonryItem targetHeightPx={100} targetWidthPx={122}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/122/100"
              />
            </MasonryItem>
            <MasonryItem targetHeightPx={100} targetWidthPx={125}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/125/100"
              />
            </MasonryItem>
            <MasonryItem targetHeightPx={100} targetWidthPx={188}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/188/100"
              />
            </MasonryItem>
            <MasonryItem targetHeightPx={100} targetWidthPx={95}>
              <ImageCard
                ariaLabel="Add image to design"
                onClick={() => {}}
                thumbnailUrl="https://picsum.photos/95/100"
              />
            </MasonryItem>
          </Masonry>
        </>
      }
      colorElement={
        <>
          <Box paddingBottom="2u">
            <Text alignment="start" capitalization="default" size="medium" variant="bold">
              Suggested color palette for your design
            </Text>
          </Box>
          <Rows spacing="2u">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "space-between",
              }}
            >
              <Text>Rosettes and Cream</Text>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <CopySwatch color="#EF7C8E" label="Hot Pink" />
                <CopySwatch color="#FAE8E0" label="Cream" />
                <CopySwatch color="#B6E2D3" label="Spearmint" />
                <CopySwatch color="#D8A7B1" label="Rosewater" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "space-between",
              }}
            >
              <Text>Summer Splash</Text>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <CopySwatch color="#05445E" label="Navy Blue" />
                <CopySwatch color="#189AB4" label="Blue Grotto" />
                <CopySwatch color="#75E6DA" label="Blue Green" />
                <CopySwatch color="#D4F1F4" label="Baby Blue" />
              </div>
            </div>
          </Rows>
        </>
      }
    />
  );
};
