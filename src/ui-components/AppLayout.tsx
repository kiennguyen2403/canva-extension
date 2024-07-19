import { Text, Box } from "@canva/app-ui-kit";
import React, { ReactElement } from "react";

export const AppLayout = ({ children }: { children?: ReactElement }) => {
  return (
    <Box paddingTop="2u" height="full">
      <Box paddingY="1u">
        <Text>Select a part of your design and let us give some suggestions</Text>
      </Box>
      <Box height="full">{children}</Box>
    </Box>
  );
};
