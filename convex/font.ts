import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const fontValidation = internalAction({
    args: {
        font: v.array(v.string()),
    },
    handler: async (ctx, { font }) => {

    },
});