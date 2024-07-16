"use client";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const wordingValidation = internalAction({
    args: {
        wording: v.array(v.string()),
    },
    handler: async (ctx, { wording }) => {
        try {
        
        } catch (e) {
            console.error(e)
            return []
        }
    }
});