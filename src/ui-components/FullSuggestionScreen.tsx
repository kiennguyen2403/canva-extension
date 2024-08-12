import React, { useContext } from "react";
import {
  Box,
  ProgressBar,
  Text,
  Rows,
  Columns,
  Column,
  FlyoutMenu,
  InfoIcon,
} from "@canva/app-ui-kit";
import { AppContext } from "./AppContext";
import { SuggestionTab } from "./SuggestionTab";
import { SuggestionType } from "src/types/Suggestion";

export const FullSuggestionScreen = () => {
  const { data } = useContext(AppContext);

  return (
    <>
      {data && typeof data != "string" ? (
        <Box paddingBottom="1u" paddingEnd="1u">
          <ProgressBar
            size="medium"
            tone={data.grade.overall >= 5 ? "info" : "critical"}
            value={data.grade.overall * 10}
          />
          <Box paddingY="1u">
            <Columns spacing="1u" alignY="center">
              <Column>
                <Text>Score: {data.grade.overall}/10</Text>
              </Column>
              <Column>
                <FlyoutMenu label="Full Scores" icon={InfoIcon}>
                  <Box padding="1u" paddingX="2u">
                    <Rows spacing="1u">
                      <Text>Overall: {data.grade.overall}/10</Text>
                      {data.grade.contentGrade && (
                        <Text>Content: {data.grade.contentGrade}/10</Text>
                      )}
                      {data.grade.fontGrade && (
                        <Text>Font: {data.grade.fontGrade}/10</Text>
                      )}
                      {data.grade.paletteGrade && (
                        <Text>Palette: {data.grade.paletteGrade}/10</Text>
                      )}
                      {data.grade.syntaxAndCorrectness && (
                        <Text>Grammar: {data.grade.syntaxAndCorrectness}</Text>
                      )}
                    </Rows>
                  </Box>
                </FlyoutMenu>
              </Column>
            </Columns>
          </Box>
          <SuggestionTab
            data={data.recommendations.map((recommendation) => ({
              suggestion: recommendation,
              type: SuggestionType.General,
            }))}
            title="Suggestions on full design"
          />
        </Box>
      ) : (
        <Box paddingY="12u" display="flex" alignItems="center">
          <Rows spacing="2u">
            <Text variant="bold" size="large" alignment="center">
              It looks like you have not received any recommendations
            </Text>
            <Text alignment="center">Try clicking "Refresh" again</Text>
          </Rows>
        </Box>
      )}
    </>
  );
};
