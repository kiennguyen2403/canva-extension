import React, { useEffect, useState, useRef, useContext } from "react";
import { LoadingIndicator, Box, ProgressBar, Text, Rows } from "@canva/app-ui-kit";
import { AppContext } from "./AppContext";
import { SuggestionTab } from "./SuggestionTab";
import { SuggestionType } from "src/types/Suggestion";
import styles from "../../styles/components.css";

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
            <Text>Score: {data.grade.overall}/10</Text>
          </Box>
          <SuggestionTab
            data={data.recommendations.map((recommendation) => ({
              suggestion: recommendation,
              type: SuggestionType.General,
              errors: [],
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
