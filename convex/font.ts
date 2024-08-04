import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalQuery } from "./_generated/server";
import { Suggestion } from "./type/types";
import { geminiHelper } from "./helpers/GeminiHelper";

export const fontInputSchema = v.array(
  v.object({
    formatting: v.object({
      color: v.optional(v.string()),
      underline: v.optional(v.boolean()),
      fontName: v.optional(v.string()),
      fontSize: v.optional(v.number()),
      italic: v.optional(v.boolean()),
      fontWeight: v.optional(v.array(v.string())), //not sure
      link: v.optional(v.string()),
      listLevel: v.optional(v.number()),
      listMarker: v.optional(v.string()), //v.enum(["none", "disc", "circle", "square", "decimal", "lower-alpha", "lower-roman", "checked", "unchecked"]),
      strikethrough: v.optional(v.boolean()),
      textAlign: v.optional(v.string()), //v.enum(["start", "center", "end", "justify"]),
    }),
    text: v.optional(v.string()),
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

// export const fontValidation = internalAction({
//   args: {
//     font: v.array(
//       v.object({
//         family: v.optional(v.string()),
//         weight: v.optional(v.string()),
//         style: v.optional(v.string()),
//         size: v.optional(v.number()),
//       })
//     ),
//   },
//   handler: async (ctx, { font }) => {
//     const suggestions: Suggestion[] = [];
//     if (font.length > 3) {
//       const suggestion: Suggestion = {
//         title: "Font",
//         type: "warning",
//         content: "Too many fonts",
//       };
//       suggestions.push(suggestion);
//     }

//     font.forEach((f) => {});

//     return suggestions;
//   },
// });

export const fontValidation = internalAction({
  args: {
    font: fontInputSchema,
  },
  handler: async (ctx, { font }) => {
    const res = await geminiHelper.assessFont(font);
    const result: string = res.response?.candidates?.[0].content?.parts?.[0]?.text ?? "No suggestions";
    return result;
  },
});
