"use client";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { fontInputSchema, Suggestion } from "./type/types";

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
      const palette: string[] = []
      const content: string[] = [];
      const fonts: fontInputSchema[] = [];
      for (const component of designs.components) {
        if (component.name === "Text") {
          content.push(component.props[0].value)
          const font: fontInputSchema = {
            text: component.props[0].value,
            formatting: {
              color: component.props?.[1]?.value,
              underline: component.props?.[2]?.value,
              fontName: component.props?.[3]?.value,
              fontSize: component.props?.[4]?.value,
              italic: component.props?.[5]?.value,
              fontWeight: component.props?.[6]?.value,
              link: component.props?.[7]?.value,
              listLevel: component.props?.[8]?.value,
              listMarker: component.props?.[9]?.value,
              textAlign: component.props?.[10]?.value,
              strikethrough: component.props?.[11]?.value,
            }
          }
          fonts.push(font);
        }
        component.props.forEach((prop) => {
          if (prop.key === "color") {
            palette.push(prop.value)
          }
        });

      }
      const paletteValidation = await ctx.runAction(
        internal.palettes.validatePalette,
        { palette: palette }
      );

      JSON.parse(paletteValidation ?? '')["recommendations"].forEach((p: string) => {
        suggestions.push({
          title: "Palette",
          type: "warning",
          content: p
        })
      })
      const wordingValidation = await ctx.runAction(
        internal.content.wordingValidation,
        { wording: content }
      );

      JSON.parse(wordingValidation ?? '')["recommendations"].forEach((p: string) => {
        suggestions.push({
          title: "Content",
          type: "warning",
          content: p
        })
      })

      const fontValidation = await ctx.runAction(
        internal.font.fontValidation,
        { font: fonts }
      );

      JSON.parse(fontValidation ?? '')["recommendations"].forEach((p: string) => {
        suggestions.push({
          title: "Font",
          type: "warning",
          content: p
        })
      })

      if (suggestions.length === 0) {
        suggestions.push({
          title: "Success",
          type: "success",
          content: "No issues found",
        })
      }

      return suggestions;
    } catch (error) {
      console.error(error)
      return [];
    }
  },
});
