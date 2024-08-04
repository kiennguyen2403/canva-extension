import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalQuery, internalAction } from "./_generated/server";
import { Suggestion } from "./type/types";
import { geminiHelper } from "./helpers/GeminiHelper";

export const queryPalettes = internalQuery({
    args: {
        palette: v.array(v.string())
    },
    handler: async (ctx, { palette }) => {
        try {
            const suggestions: any[] = [];
            const palettes = await ctx.db.query("palettes").collect(); 
            const match =  palettes.filter(p => {
                return palette.every(c => p.colors.includes(c))
            });
            
            if (match.length) {
                match.forEach(m => {
                    suggestions.push({
                        palette: m.colors,
                        missing: []
                    });
                });
                return suggestions;
            }
        
            palettes.forEach(p => {
                const diff = palette.filter(c => !p.colors.includes(c));
                suggestions.push({
                    palette: p.colors,
                    missing: diff
                });
            });
            return suggestions.sort((a, b) => a.missing.length - b.missing.length);
            
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
            // const response: Suggestion[] = [];
            // const palettes: any[] = await ctx.runQuery(internal.palettes.queryPalettes, { palette })
            // if (palettes.length == 0) {
            //     response.push({
            //         title: "Palette",
            //         type: "warning",
            //         content: "No matching palettes found"
            //     });
            // } else if (palettes[0].missing.length > 0) {
            //     response.push({
            //         title: "Palette",
            //         type: "warning",
            //         content: "Multiples palettes used in your design",
            //     });
            // } else {
            //     response.push({
            //         title: "Palette",
            //         type: "success",
            //         content: "Palette is valid",
            //     });
            // }
            // return response;
            const res = await geminiHelper.assessColourPallete(palette);
            const result: string = res.response?.candidates?.[0].content.parts[0].text ?? "No suggestions";
            return result;
        } catch (e) {
            console.error(e)
            return null
        }
    },
});