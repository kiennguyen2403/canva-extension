import React from "react";
import { Box, Rows, Swatch, Text } from "@canva/app-ui-kit";
import { Suggestion } from "../types/Suggestion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const SuggestionTabPalette = ({ suggestions }: { suggestions: Suggestion[] }) => {
  let colors: string[] = [];

  suggestions.forEach(({ suggestion }) => {
    const currentColors = suggestion.split(" ").filter((c) => c.startsWith("#"));
    colors = [...colors, ...currentColors];
  });

  const queryPalettes = useQuery(api.palettes.queryPalettes, { palette: colors });
  console.log(queryPalettes);
  return (
    <>
      <Box paddingBottom="2u">
        <Text alignment="start" capitalization="default" size="medium" variant="bold">
          Suggested color palette for your design
        </Text>
      </Box>
      <Rows spacing="2u">
        {queryPalettes?.map(({ missing, name, palette }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              justifyContent: "space-between",
            }}
          >
            <Text>{name}</Text>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {palette?.map((color) => (
                <CopySwatch color={color} />
              ))}
            </div>
          </div>
        ))}
      </Rows>
    </>
  );
};

export const CopySwatch = ({ color, label }: { color: string; label?: string }) => (
  <Swatch
    fill={[color]}
    onClick={() => {
      navigator.clipboard.writeText(color);
    }}
    size="xsmall"
    variant="solid"
    tooltipLabel={label}
  />
);
