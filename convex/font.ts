import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalQuery } from "./_generated/server";
import { Suggestion } from "./type/types";
import { geminiHelper } from "../utils/helpers/GeminiHelper";

export const fontInputSchema = v.array(
  v.object({
    formatting: v.object({
      color: v.string(),
      underline: v.boolean(),
      fontName: v.string(),
      fontSize: v.number(),
      italic: v.boolean(),
      fontWeight: v.array(v.string()), //not sure
      link: v.string(),
      listLevel: v.number(),
      listMarker: v.string(), //v.enum(["none", "disc", "circle", "square", "decimal", "lower-alpha", "lower-roman", "checked", "unchecked"]),
      strikethrough: v.boolean(),
      textAlign: v.string(), //v.enum(["start", "center", "end", "justify"]),
    }),
    text: v.string(),
  })
);

export const fontRulesQuery = internalQuery({
  args: {
    font: v.array(
      v.object({
        family: v.optional(v.string()),
        weight: v.optional(v.string()),
        style: v.optional(v.string()),
        size: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { font }) => {
    try {
      const suggestions: any[] = [];
      const fontRules = await ctx.db.query("fontRules").collect();
      const match = fontRules.filter((f) => {
        return font.every(
          (c) =>
            c.family == f.family &&
            c.weight == f.weight &&
            c.style == f.style &&
            (c.size ?? 0) <= f.size
        );
      });

      match.forEach((m) => {
        suggestions.push({
          invalidFont: m,
        });
      });

      return suggestions;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
});

export const fontValidation = internalAction({
  args: {
    font: v.array(
      v.object({
        family: v.optional(v.string()),
        weight: v.optional(v.string()),
        style: v.optional(v.string()),
        size: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { font }) => {
    const suggestions: Suggestion[] = [];
    if (font.length > 3) {
      const suggestion: Suggestion = {
        title: "Font",
        type: "warning",
        content: "Too many fonts",
      };
      suggestions.push(suggestion);
    }

    font.forEach((f) => {});

    return suggestions;
  },
});

export const assessFont = internalAction({
  args: {
    font: fontInputSchema,
  },
  handler: async (ctx, { font }) => {
    const res = await geminiHelper.assessFont(font);
    const result = JSON.parse(res);
    return;
  },
});
