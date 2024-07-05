import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tasks: defineTable({
        text: v.string(),
        isCompleted: v.boolean(),
    }),
    design: defineTable({
        name: v.string(),
        components: v.array(v.id("component"))
    }),
    component: defineTable({
        name: v.string(),
        props: v.array(
            v.object({
                key: v.string(),
                value: v.any(),
            })),
    }),
});