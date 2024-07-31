import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import axios from "axios";
import { ImageModelResponse, Suggestion } from "./type/types";

const http = httpRouter();

http.route({
  path: "/api/images",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      console.log("Request received");
      console.log(process.env.ROBLOW_API);
      console.log(process.env.ROBLOW_API_KEY);
      const suggestions: Suggestion[] = [];
      const blob = await request.blob();
      const storageId = await ctx.storage.store(blob);
      const url = await ctx.storage.getUrl(storageId);
      console.log("url: ",url);
      const response:any = await axios({
        method: "POST",
        url: process.env.ROBLOW_API,
        params: {
          api_key: process.env.ROBLOW_API_KEY,
          image: url,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      const review: ImageModelResponse = response.data;
      const badReviews: string[] = [
        "Too-much-words",
        "Too-many-fonts",
        "Wrong-palettes",
        "Bad-images",
        "Bad-typo-colors",
      ];
      const goodReviews: string[] = [
        "Right-fonts",
        "Right-images",
        "Right-number-of-words",
        "Right-palettes",
        "Right-typo-colors",
      ];
      review.predicted_classes.forEach((predictedClass) => {
        if (badReviews.includes(predictedClass)) {
          suggestions.push({
            title: "Too many images",
            type: "warning",
            content:
              "You have too many images in your design. Consider reducing the number of images to improve performance.",
          });
        }
      });

      return new Response(JSON.stringify(suggestions), {
        status: 200,
        statusText: "OK",
        headers: new Headers({
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
          Vary: "origin",
        }),
      });
    } catch (e) {
      console.error(e);
      return new Response("Error", {
        status: 500,
        headers: new Headers({
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
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
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
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