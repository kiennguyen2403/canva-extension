import React from "react";
import { Box, ImageCard, Rows, Text, TextPlaceholder } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addNativeElement, ui } from "@canva/design";

export const SuggestionTabMedia = ({ url }: { url: string }) => {
  async function handleClick() {
    const imageAsset = await upload({
      mimeType: "image/jpeg",
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
  }

  function handleDragStart(event: React.DragEvent<HTMLElement>) {
    ui.startDrag(event, {
      type: "IMAGE",
      resolveImageRef: () => {
        return upload({
          mimeType: "image/jpeg",
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
  }

  return (
    <>
      <Box paddingBottom="2u">
        <Text alignment="start" capitalization="default" size="medium" variant="bold">
          Suggested images for your design
        </Text>
        <br />
        {url !== "" ? (
          <Rows spacing="1u">
            <ImageCard
              ariaLabel="Add image to design"
              alt="Suggested image"
              thumbnailUrl={url}
              onDragStart={handleDragStart}
              onClick={handleClick}
            />
          </Rows>
        ) : (
          <Rows spacing="1u">
            <TextPlaceholder size="xlarge" />
            <Text>Please wait up to 1 minute for our AI assistant to generate the image</Text>
          </Rows>
        )}
      </Box>
    </>
  );
};
