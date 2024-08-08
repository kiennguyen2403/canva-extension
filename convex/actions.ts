"use client";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import fetch from "node-fetch";
import { Font, Suggestion } from "./type/types";
import { link } from "fs";

export const designInputSchema = v.object({
  naming: v.string(),
  components: v.array(
    v.object({
      name: v.string(),
      props: v.array(v.object({ key: v.string(), value: v.any() })),
    })
  ),
});

export const generateSuggestions = action({
  args: {
    designs: designInputSchema,
  },
  handler: async (ctx, { designs }) => {
    try {
      let suggestions: Suggestion[] = [];
      const palette: string[] = [];
      const content: string[] = [];
      const fonts: Font[] = [];
      for (const component of designs.components) {
        switch (component.name) {
          case "Text":
            content.push(component.props[0].value);
            break;
          case "TextFont":
            const props = component.props;
            const font: Font = {
              text: props[0].value,
              formatting:
                props.length > 1
                  ? {
                      color: props[1].value,
                      underline: props[2].value,
                      fontName: props[3].value,
                      fontSize: props[4].value,
                      italic: props[5].value,
                      fontWeight: props[6].value,
                      link: props[7].value,
                      listLevel: props[8].value,
                      listMarker: props[9].value,
                      textAlign: props[10].value,
                      strikethrough: props[11].value,
                    }
                  : undefined,
            };
            fonts.push(font);
            break;
        }

        component.props.forEach((prop) => {
          if (prop.key === "color") {
            palette.push(prop.value);
          }
        });
      }

      const paletteValidation: string | null = await ctx.runAction(
        internal.palettes.validatePalette,
        {
          palette: palette,
        }
      );

      JSON.parse(paletteValidation ?? "")["recommendations"].forEach((p: string) => {
        suggestions.push({
          title: "Palette",
          type: "warning",
          content: p,
        });
      });

      console.log(`palette: ${paletteValidation}`);

      const wordingValidation: string | null = await ctx.runAction(
        internal.content.wordingValidation,
        { wording: content }
      );

      JSON.parse(wordingValidation ?? "")["recommendations"].forEach((p: string) => {
        suggestions.push({
          title: "Content",
          type: "warning",
          content: p,
        });
      });

      console.log(`wording: ${wordingValidation}`);

      const fontValidation: string | null = await ctx.runAction(internal.font.fontValidation, {
        font: fonts,
      });

      JSON.parse(fontValidation ?? "")["recommendations"].forEach((p: string) => {
        suggestions.push({
          title: "Font",
          type: "warning",
          content: p,
        });
      });

      console.log(`font: ${fontValidation}`);

      if (suggestions.length === 0) {
        suggestions.push({
          title: "Success",
          type: "success",
          content: "No issues found",
        });
      }

      return suggestions;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});
