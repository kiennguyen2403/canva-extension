import { Text, Box, ArrowRightIcon, ArrowLeftIcon } from "@canva/app-ui-kit";
import React, { ReactElement } from "react";
import styles from "../../styles/layout.css";
import { AppScreenType } from "src/types/Screen";

export const AppLayout = ({
  children,
  screen,
  setScreen,
}: {
  children?: ReactElement;
  screen: AppScreenType;
  setScreen: (screen: AppScreenType) => void;
}) => {
  return (
    <Box paddingTop="2u" height="full">
      <Box paddingY="1u">
        <Text>
          {screen === AppScreenType.SelectionSuggestionScreen ? (
            <>
              Select a part of your design and let us give some suggestions in real time or{" "}
              <span
                className={styles.nativeLink}
                onClick={() => {
                  setScreen(AppScreenType.FullSuggestionScreen);
                }}
              >
                do a full design suggestion <ArrowRightIcon />
              </span>
            </>
          ) : (
            <>
              <span
                className={styles.nativeLink}
                onClick={() => {
                  setScreen(AppScreenType.SelectionSuggestionScreen);
                }}
              >
                <ArrowLeftIcon /> Return back
              </span>
            </>
          )}
        </Text>
      </Box>
      <Box height="full">{children}</Box>
    </Box>
  );
};
