import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import axios from "axios";
import { ImageModelResponse, Suggestion } from "./type/types";
import { geminiHelper } from "./helpers/GeminiHelper";

const http = httpRouter();

http.route({
  path: "/api/images",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      console.log("Request received");
      const suggestions: Suggestion[] = [];
      const blob = await request.blob();
      const storageId = await ctx.storage.store(blob);
      const url = await ctx.storage.getUrl(storageId);
      console.log("url: ", process.env.ROBOFLOW_API);
      console.log("key: ", process.env.ROBOFLOW_API_KEY);
      const response: any = await axios({
        method: "POST",
        url: process.env.ROBOFLOW_API,
        params: {
          api_key: process.env.ROBOFLOW_API_KEY,
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
        let content = "";
        let title = "";
        switch (predictedClass) {
          case "Too-much-words":
            title = "Too many words";
            content = "There are too many words in the image. Try to reduce the number of words.";
            break;
          case "Too-many-fonts":
            title = "Too many fonts";
            content = "There are too many fonts in the image. Try to use a single font.";
            break;
          case "Wrong-palettes":
            title = "Wrong color palette";
            content = "The color palette is not suitable for the image. Try to use a different color palette.";
            break;
          case "Bad-images":
            title = "Bad image quality";
            content = "The image quality is not good. Try to use a high-quality image.";
            break;
          case "Bad-typo-colors":
            title = "Bad typo colors";
            content = "The typo colors are not suitable for the image. Try to use a different color.";
            break;
        }
        if (content !== "") {
          suggestions.push({
            title: title,
            type: "warning",
            content: content
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


http.route({
  path: "/api/test",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const response = {
        api: process.env.ROBOFLOW_API,
        key: process.env.ROBOFLOW_API_KEY
      }
      return new Response(JSON.stringify(response), {
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
export default http;