import React, { useEffect, useState, useRef } from "react";
import { LoadingIndicator, Box, ProgressBar, Text } from "@canva/app-ui-kit";

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
        <Box paddingY="1u">
          <Text>Score: 85/100</Text>
        </Box>
      </Box>
    </>
  );
};
