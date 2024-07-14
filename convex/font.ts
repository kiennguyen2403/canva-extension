import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { Suggestion } from "./type/types";

export const fontValidation = internalAction({
    args: {
        font: v.array(v.object(
            {
                family: v.optional(v.string()),
                weight: v.optional(v.string()),
                style: v.optional(v.string()),
                size: v.optional(v.number()),
            }
        )),
    },
    handler: async (ctx, { font }) => {
        const suggestions: Suggestion[] = [];
        if (font.length > 3) {
            const suggestion: Suggestion = {
                title: "Font",
                type: "warning",
                content: "Too many fonts"
            }
            suggestions.push(suggestion);
        }

        font.forEach(f => {
            if (f.family === "Arial" && f.weight === "bold" && f.style === "italic") {
                const suggestion: Suggestion = {
                    title: "Font",
                    type: "warning",
                    content: "Arial bold italic is not recommended"
                }
                suggestions.push(suggestion);
            }
        });

        return suggestions;
    },
});