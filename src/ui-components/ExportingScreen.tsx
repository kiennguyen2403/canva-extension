import React from "react";
import { LoadingComponent } from "./LoadingComponent";
import { Box } from "@canva/app-ui-kit";
import styles from "../../styles/components.css";

export const ExportingScreen = () => {
  return (
    <Box
      className={styles.fullHeight}
      display="flex"
      alignItems="center"
      paddingTop="12u"
    >
      <LoadingComponent
        texts={[
          "Exporting design to server",
          "Analysing and gathering info",
          "Retrieving AI suggestions",
        ]}
      />
    </Box>
  );
};
