"use client";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { geminiHelper } from "./helpers/GeminiHelper";

const wordingInputSchema = v.array(v.string());

export const wordingValidation = internalAction({
  args: {
    wording: wordingInputSchema,
  },
  handler: async (ctx, { wording }) => {
    try {
      const res = await geminiHelper.assessWording(wording);
      const result: string = res.response?.candidates?.[0].content?.parts?.[0]?.text ?? "No suggestions";
      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
});
