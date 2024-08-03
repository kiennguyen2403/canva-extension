"use client";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { geminiHelper } from "./helpers/GeminiHelper";

export const fontInputSchema = v.array(v.string());

export const wordingValidation = internalAction({
  args: {
    wording: fontInputSchema,
  },
  handler: async (ctx, { wording }) => {
    try {
      const res = await geminiHelper.assessWording(wording);
      const result: string = JSON.parse(res.response?.candidates?.[0]?.finishMessage ?? "");
      return result;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
});
