import {
  Text,
  Box,
  ArrowRightIcon,
  ArrowLeftIcon,
  Button,
} from "@canva/app-ui-kit";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import styles from "../../styles/layout.css";
import { AppScreenType } from "src/types/Screen";
import { requestExport } from "@canva/design";
import axios from "axios";
import { getFileFromUrl } from "../utils/getFileFromUrl";
import { AppContext, AppContextData } from "./AppContext";
import { ToastContainer } from "react-toastify";

export const AppLayout = ({ children }: { children?: ReactElement }) => {
  const [exportingState, setExportingState] = useState<"exporting" | "idle">(
    "idle"
  );

  const { screen, setScreen, data, setData } = useContext(AppContext);

  useEffect(() => {
    if (exportingState === "exporting") {
      setScreen(AppScreenType.ExportingScreen);
    }
  }, [exportingState]);

  const exportDocument = async () => {
    if (exportingState === "exporting") return;
    try {
      setExportingState("exporting");

      const response = await requestExport({
        acceptedFileTypes: ["PNG"],
      });

      if (response.status === "ABORTED") {
        setScreen(AppScreenType.SelectionSuggestionScreen);
      } else {
        const designUrl = response.exportBlobs[0].url;
        const file = await getFileFromUrl(designUrl, response.title);
        const convexDeploymentUrl = process.env.CONVEX_URL;
        const convexSiteUrl =
          convexDeploymentUrl && convexDeploymentUrl.endsWith(".cloud")
            ? convexDeploymentUrl.substring(
                0,
                convexDeploymentUrl.length - ".cloud".length
              ) + ".site"
            : convexDeploymentUrl;
        let formData = new FormData();
        formData.append("file", file, response.title);
        const result = await axios.post(
          `${convexSiteUrl}/api/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setData(result.data as unknown as AppContextData);
        setScreen(AppScreenType.FullSuggestionScreen);
      }
    } catch (error) {
      alert(error);
      setScreen(AppScreenType.SelectionSuggestionScreen);
    } finally {
      setExportingState("idle");
    }
  };

  return (
    <Box padding="2u" className={styles.fullHeight}>
      {screen !== AppScreenType.ExportingScreen && (
        <Box paddingY="1u">
          <Text>
            {screen === AppScreenType.SelectionSuggestionScreen && (
              <>
                Select a part of your design and let us give some suggestions in
                real time or{" "}
                <span
                  className={styles.nativeLink}
                  onClick={() => {
                    if (data) {
                      setScreen(AppScreenType.FullSuggestionScreen);
                    } else {
                      exportDocument();
                    }
                  }}
                >
                  do a full design suggestion <ArrowRightIcon />
                </span>
              </>
            )}

            {screen === AppScreenType.FullSuggestionScreen && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className={styles.nativeLink}
                  onClick={() => {
                    setScreen(AppScreenType.SelectionSuggestionScreen);
                  }}
                >
                  <ArrowLeftIcon /> Return back
                </span>
                <Button
                  alignment="center"
                  onClick={exportDocument}
                  variant="primary"
                >
                  Refresh
                </Button>
              </div>
            )}
          </Text>
        </Box>
      )}

      <Box className={styles.appContainer}>{children}</Box>
      <ToastContainer bodyClassName={() => "text-sm font-med block p-3 "} />
    </Box>
  );
};
