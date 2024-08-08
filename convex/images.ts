"use client";
import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";
import axios from "axios";

export const uploadImagesToModel = internalAction({
    handler: async (ctx) => {
        try {  
            const images = await ctx.runQuery(internal.images.getImages);
            for (const image of images) {
                await ctx.runMutation(internal.images.deleteImage, { url: image.url, storageId: image.storageId, id: image._id });
                await axios({
                    method: "POST",
                    url: process.env.ROBOFLOW_API,
                    params: {
                        api_key: process.env.ROBOFLOW_API_KEY,
                        image: image.url,
                    },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
            }
        } catch (e) {
            console.error(e);
            return;
        }
    }
});


export const saveImageUrl = internalMutation({
    args: {
        url: v.string(),
        storageId: v.id("_storage"),
    },
    handler: async (ctx, { url, storageId }) => {
        try {
            await ctx.db.insert("images", { url, storageId });
        } catch (e) {
            console.error(e);
            return [];
        }
    }
});


export const getImages = internalQuery({
    handler: async (ctx) => {
        try {
            const images = await ctx.db.query("images").collect();
            return images;
        } catch (e) {
            console.error(e);
            return [];
        }
    }
});

export const deleteImage = internalMutation({
    args: {
        url: v.string(),
        storageId: v.id("_storage"),
        id: v.id("images"),
    },
    handler: async (ctx, { url, storageId, id}) => {
        try {
            await ctx.storage.delete(storageId);
            await ctx.db.delete(id);
        } catch (e) {
            console.error(e);
            return [];
        }
    }
});

export default uploadImagesToModel;