import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { title } from "process";

export default defineSchema({
    designs: defineTable({
        name: v.string(),
        components: v.array(v.id("components"))
    }),
    components: defineTable({
        name: v.string(),
        props: v.array(
            v.object({
                key: v.string(),
                value: v.any(),
            })),
    }),
    suggestion: defineTable({
        title: v.string(),
        type: v.string(),
        content: v.string(),
    }),
    palettes: defineTable({
        colors: v.array(v.string()),
    }),
});