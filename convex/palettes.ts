import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalQuery, internalAction } from "./_generated/server";

export const queryPalettes = internalQuery({
    args: {
        palette: v.array(v.string())
    },
    handler: async (ctx, { palette }) => {
        try {
            const palettes = await ctx.db.query("palettes").collect(); 
            return palettes.filter(p => {
                return palette.every(c => p.colors.includes(c))
            });
        } catch (e) {
            console.error(e)
            return []
        }
    }
});

export const validatePalette = internalAction({
    args: {
        palette: v.array(v.string()),
    },
    handler: async (ctx, { palette }) => {
        try {
            const response = [];
            const palettes: any[] = await ctx.runQuery(internal.palettes.queryPalettes, { palette })
            return palettes;
        } catch (e) {
            console.error(e)
            return []
        }
    },
});