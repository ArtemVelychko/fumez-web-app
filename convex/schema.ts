import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),

  materials: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    cas: v.optional(v.string()),
    altName: v.optional(v.string()),
    fragnancePyramid: v.optional(v.object({
      base: v.optional(v.string()),
      baseMid: v.optional(v.string()),
      mid: v.optional(v.string()),
      midTop: v.optional(v.string()),
      top: v.optional(v.string()),
    })),
    ifralimit: v.optional(v.number()),
    dilutions: v.optional(v.array(v.number())),
    dateObtained: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),
});
