import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalQuery, internalAction, action, query} from "./_generated/server";
import { Suggestion } from "./type/types";
import { geminiHelper } from "./helpers/GeminiHelper";

export const queryPalettes = query({
    args: {
        palette: v.array(v.string())
    },
    handler: async (ctx, { palette }) => {
        try {
            const suggestions: any[] = [];
            const palettes = await ctx.db.query("palettes").collect() 
            const match =  palettes.filter(p => {
                return palette.every(c => p.colors.includes(c));
            });
            
            if (match.length) {
                match.forEach(m => {
                    suggestions.push({
                        palette: m.colors,
                        name: m.name,
                        missing: []
                    });
                });
                return suggestions.slice(0, 5);
            }
        
            palettes.forEach(p => {
                const diff = palette.filter(c => !p.colors.includes(c));
                suggestions.push({
                    palette: p.colors,
                    name: p.name,
                    missing: diff
                });
            });

            return suggestions.sort((a, b) => a.missing.length - b.missing.length).slice(0, 5);
            
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
            const res = await geminiHelper.assessColourPallete(palette);
            const result: string = res.response?.candidates?.[0].content.parts[0].text ?? "No suggestions";
            return result;
        } catch (e) {
            console.error(e)
            return null
        }
    },
});