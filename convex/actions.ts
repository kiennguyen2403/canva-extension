"use client";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import fetch from "node-fetch";
import { fontInputSchema, Suggestion } from "./type/types";
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
    let suggestions: Suggestion[] = [];
    const palette: string[] = [];
    const content: string[] = [];
    const fonts: fontInputSchema[] = [];
    for (const component of designs.components) {
      switch (component.name) {
        case "Text":
          content.push(component.props[0].value);
          break;
        case "TextFont":
          const props = component.props;
          const font: fontInputSchema = {
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
    const paletteValidation = await ctx.runAction(internal.palettes.validatePalette, {
      palette: palette,
    });

    const wordingValidation = await ctx.runAction(internal.content.wordingValidation, {
      wording: content,
    });

    const fontValidation = await ctx.runAction(internal.font.fontValidation, { font: fonts });
    console.log(`wording: ${wordingValidation}`);
    suggestions = [...paletteValidation];
    console.log(`palette: ${JSON.stringify(paletteValidation)}`);
    console.log(`font: ${fontValidation}`);

    return suggestions;
  },
});
