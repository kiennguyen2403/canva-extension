import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import axios from "axios";

const http = httpRouter();

http.route({
    path: "/api/images",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        try {
            const blob = await request.blob();
            const response = axios({
                method: "POST",
                url: process.env.IMAGE_API!,
                params: {
                    api_key: "YOUR_KEY"
                },
                data: blob,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            return new Response("Success", {
                status: 200,
                headers: new Headers({
                    "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
                    Vary: "origin",
                })
            });
        } catch (e) {
            console.error(e)
            return new Response("Error", {
                status: 500,
                headers: new Headers({
                    "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
                    Vary: "origin",
                })
            });
        }
    })
})

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