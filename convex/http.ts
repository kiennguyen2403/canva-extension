"use client";
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import axios from "axios";
import b64toBlob from "b64-to-blob";
import { Design, ImageModelResponse, Suggestion } from "./type/types";
import { geminiHelper } from "./helpers/GeminiHelper";

const http = httpRouter();

http.route({
  path: "/api/images",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      console.log("Request received");
      const formData = await request.formData();
      const blob = formData.get("file") as Blob;
      const design: Design = JSON.parse(formData.get("design") as string);
      const components = design
        ? design.components.map((component) => {
            return {
              name: component.name,
              props: Object.entries(component.props).map(([key, value]) => {
                return {
                  key,
                  value,
                };
              }),
            };
          })
        : [];
      const designObject = {
        naming: design?.naming || "",
        components: components,
      };

      if (!blob)
        return new Response("No image found", {
          status: 400,
          headers: new Headers({
            "Access-Control-Allow-Origin": process.env.CANVA_APP_ORIGIN!,
            Vary: "origin",
          }),
        });

      const storageId = await ctx.storage.store(blob);
      const url = await ctx.storage.getUrl(storageId);
      if (!url)
        return new Response("Error", {
          status: 500,
          headers: new Headers({
            "Access-Control-Allow-Origin": process.env.CANVA_APP_ORIGIN!,
            Vary: "origin",
          }),
        });

      await ctx.runMutation(internal.images.saveImageUrl, { url, storageId });
      const response: any = await axios({
        method: "POST",
        url: process.env.ROBOFLOW_API,
        params: {
          api_key: process.env.ROBOFLOW_API_KEY,
          image: url,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const review: ImageModelResponse = response.data;

      const finalReview = await ctx.runAction(internal.actions.generateFinalReview, {
        designs: designObject,
        tags: review.predicted_classes,
      });
      return new Response(JSON.stringify(finalReview), {
        status: 200,
        statusText: "OK",
        headers: new Headers({
          "Access-Control-Allow-Origin": process.env.CANVA_APP_ORIGIN!,
          Vary: "origin",
        }),
      });
    } catch (e) {
      console.error(e);
      return new Response("Error", {
        status: 500,
        headers: new Headers({
          "Access-Control-Allow-Origin": process.env.CANVA_APP_ORIGIN!,
          Vary: "origin",
        }),
      });
    }
  }),
});

http.route({
  path: "/api/images",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          "Access-Control-Allow-Origin": process.env.CANVA_APP_ORIGIN!,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/api/templates",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      console.log("Request received");
      const prompts = await request.json();
      const response = await axios.post(process.env.TEMPLATE_API!, prompts);

      const prototype = b64toBlob(response.data.prototype, "image/png");
      const storageId = await ctx.storage.store(prototype!);
      const url = await ctx.storage.getUrl(storageId);
      const received = await Promise.all(
        response.data["received_data"].map(async (data: any) => {
          if (!["Number", "Title", "Description", "Name"].includes(data["class"])) {
            const blob = b64toBlob(data["data"] as string, "image/png");
            const storageId = await ctx.storage.store(blob);
            const url = await ctx.storage.getUrl(storageId);
            data["data"] = url;
          }
          return data;
        })
      );

      const result = {
        url,
        received,
      };
      return new Response(JSON.stringify(result), {
        status: 200,
        statusText: "OK",
        headers: new Headers({
          "Access-Control-Allow-Origin": process.env.CANVA_APP_ORIGIN!,
          Vary: "origin",
        }),
      });
    } catch (e) {
      console.error(e);
      return new Response("Error", {
        status: 500,
        headers: new Headers({
          "Access-Control-Allow-Origin": process.env.CANVA_APP_ORIGIN!,
          Vary: "origin",
        }),
      });
    }
  }),
});

http.route({
  path: "/api/templates",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          "Access-Control-Allow-Origin": process.env.CANVA_APP_ORIGIN!,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;
