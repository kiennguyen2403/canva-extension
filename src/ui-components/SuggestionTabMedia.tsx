import React from "react";
import { Box, ImageCard, Masonry, MasonryItem, Text } from "@canva/app-ui-kit";

export const SuggestionTabMedia = () => {
  return (
    <>
      <Box paddingBottom="2u">
        <Text alignment="start" capitalization="default" size="medium" variant="bold">
          Suggested images for your design
        </Text>
      </Box>
      <Masonry targetRowHeightPx={100}>
        <MasonryItem targetHeightPx={100} targetWidthPx={106}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/106/100"
          />
        </MasonryItem>
        <MasonryItem targetHeightPx={100} targetWidthPx={54}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/54/100"
          />
        </MasonryItem>
        <MasonryItem targetHeightPx={100} targetWidthPx={185}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/185/100"
          />
        </MasonryItem>
        <MasonryItem targetHeightPx={100} targetWidthPx={167}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/167/100"
          />
        </MasonryItem>
        <MasonryItem targetHeightPx={100} targetWidthPx={114}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/114/100"
          />
        </MasonryItem>
        <MasonryItem targetHeightPx={100} targetWidthPx={133}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/133/100"
          />
        </MasonryItem>
        <MasonryItem targetHeightPx={100} targetWidthPx={122}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/122/100"
          />
        </MasonryItem>
        <MasonryItem targetHeightPx={100} targetWidthPx={125}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/125/100"
          />
        </MasonryItem>
        <MasonryItem targetHeightPx={100} targetWidthPx={188}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/188/100"
          />
        </MasonryItem>
        <MasonryItem targetHeightPx={100} targetWidthPx={95}>
          <ImageCard
            ariaLabel="Add image to design"
            onClick={() => {}}
            thumbnailUrl="https://picsum.photos/95/100"
          />
        </MasonryItem>
      </Masonry>
    </>
  );
};
