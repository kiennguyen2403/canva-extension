import React, { useState } from "react";
import {
  ArrowLeftIcon,
  Box,
  Button,
  Column,
  Columns,
  FormField,
  ImageCard,
  Masonry,
  MasonryItem,
  Rows,
  Text,
  TextInput,
  TextPlaceholder,
} from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addNativeElement, ui } from "@canva/design";
import styles from "../../styles/components.css";
import axios from "axios";

export const SuggestionTabMedia = ({
  designPrompt,
  noSelectionText,
}: {
  designPrompt?: string;
  noSelectionText?: string;
}) => {
  const [main, setMain] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [urls, setUrls] = useState<string[]>([]);

  const handleClick = async (url) => {
    const imageAsset = await upload({
      mimeType: "image/png",
      thumbnailUrl: url,
      type: "IMAGE",
      url,
      width: 320,
      height: 212,
    });

    addNativeElement({
      type: "IMAGE",
      ref: imageAsset.ref,
    });
  };

  const handleDragStart = (event: React.DragEvent<HTMLElement>, url) => {
    ui.startDrag(event, {
      type: "IMAGE",
      resolveImageRef: () => {
        return upload({
          mimeType: "image/png",
          thumbnailUrl: url,
          type: "IMAGE",
          url,
          width: 320,
          height: 212,
        });
      },
      previewUrl: url,
      previewSize: {
        width: 320,
        height: 212,
      },
      fullSize: {
        width: 320,
        height: 212,
      },
    });
  };

  const submitPrompt = async (text: string) => {
    setMain(false);
    setUrls([]);

    /** Use convex to generate image based on design text */
    const convexDeploymentUrl = process.env.CONVEX_URL;
    const convexSiteUrl =
      convexDeploymentUrl && convexDeploymentUrl.endsWith(".cloud")
        ? convexDeploymentUrl.substring(
            0,
            convexDeploymentUrl.length - ".cloud".length
          ) + ".site"
        : convexDeploymentUrl;

    const result = await axios.post(
      `${convexSiteUrl}/api/templates`,
      {
        prompt: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (result.status === 200) {
      console.log(result);
      setUrls([
        result.data.url,
        [...result.data.received.map(({ data }) => data)],
      ]);
    }
  };

  const loadingText =
    "Please wait up to 1 minute for our AI assistant to generate";

  return (
    <>
      <Box paddingY="1u">
        {main ? (
          <Rows spacing="8u">
            <FormField
              control={(props) => (
                <Columns spacing="1u" alignY="center">
                  <Column width="2/3">
                    <TextInput
                      {...props}
                      onChange={(value) => {
                        setPrompt(value);
                      }}
                    />
                  </Column>
                  <Column>
                    <Box className={styles.submitBtnContainer}>
                      <Button
                        onClick={() => prompt && submitPrompt(prompt)}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Box>
                  </Column>
                </Columns>
              )}
              label="Generate images through a prompt"
            />
            <Text alignment="center" size="xlarge">
              OR
            </Text>
            <Rows spacing="1u">
              {noSelectionText ? (
                <Box>
                  <Text
                    alignment="start"
                    capitalization="default"
                    size="medium"
                    variant="bold"
                  >
                    Generate images based on design
                  </Text>
                  <br />
                  <Text>{noSelectionText}</Text>
                </Box>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  className={styles.submitBtnContainer}
                >
                  <Button
                    onClick={() => designPrompt && submitPrompt(designPrompt)}
                    variant="primary"
                  >
                    Generate images based on design
                  </Button>
                </Box>
              )}
            </Rows>
          </Rows>
        ) : (
          <Rows spacing="2u">
            <Text>
              <span className={styles.nativeLink} onClick={() => setMain(true)}>
                <ArrowLeftIcon />
                Back
              </span>
            </Text>
            {urls.length > 0 ? (
              <Masonry targetRowHeightPx={100}>
                {urls.map((url, id) => (
                  <MasonryItem
                    targetHeightPx={100}
                    targetWidthPx={targetWidthPx[id]}
                  >
                    <ImageCard
                      ariaLabel="Add image to design"
                      alt="Suggested image"
                      thumbnailUrl={url}
                      onDragStart={(event: React.DragEvent<HTMLElement>) =>
                        handleDragStart(event, url)
                      }
                      onClick={() => handleClick(url)}
                    />
                  </MasonryItem>
                ))}
              </Masonry>
            ) : (
              <Rows spacing="1u">
                <TextPlaceholder size="xlarge" />
                <Text>{loadingText}</Text>
              </Rows>
            )}
          </Rows>
        )}
      </Box>
    </>
  );
};

const targetWidthPx = [106, 54, 185, 167, 114, 133, 122, 125, 188, 95];
