import React, { useEffect, useState } from "react";
import { LoadingIndicator, Box, ProgressBar, Text } from "@canva/app-ui-kit";
import { SuggestionTabContainer } from "./SuggestionTabContainer";

export const FullSuggestionScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  return isLoading ? (
    <Box padding="12u">
      <LoadingIndicator size="large" />
    </Box>
  ) : (
    <>
      <Box paddingBottom="1u" paddingEnd="1u">
        <ProgressBar size="medium" tone="info" value={85} />
        {/* <ProgressBar size="medium" tone="critical" value={15} /> */}
        <Text>Score: 85/100</Text>
      </Box>

      <SuggestionTabContainer />
    </>
  );
};