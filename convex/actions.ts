"use client";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import fetch from "node-fetch";
import { Suggestion } from "./type/types";


export const generateSuggestions = action({
    args: {
        designs: v.array(v.string()),
    },
    handler: async (ctx, { designs }) => {
        const suggestions: Suggestion[] = [];
        const fontValidation = await ctx.runAction(internal.font.fontValidation, { font: ["Arial"] });
        const paletteValidation = await ctx.runAction(internal.palettes.validatePalette, { palette: ["#000000", "#FFFFFF"] });
        const response = await fetch("");
        return suggestions;
    },
});