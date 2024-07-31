/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.12.2.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions from "../actions.js";
import type * as content from "../content.js";
import type * as font from "../font.js";
import type * as helpers_GeminiHelper_index from "../helpers/GeminiHelper/index.js";
import type * as helpers_GeminiHelper_prompts from "../helpers/GeminiHelper/prompts.js";
import type * as http from "../http.js";
import type * as palettes from "../palettes.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  content: typeof content;
  font: typeof font;
  "helpers/GeminiHelper/index": typeof helpers_GeminiHelper_index;
  "helpers/GeminiHelper/prompts": typeof helpers_GeminiHelper_prompts;
  http: typeof http;
  palettes: typeof palettes;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
