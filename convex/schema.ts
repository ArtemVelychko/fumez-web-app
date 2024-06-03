import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    childrenDocuments: v.optional(v.array(v.id("documents"))),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
    materialsInFormula: v.optional(
      v.array(
        v.object({
          material: v.id("materials"),
          weight: v.number(),
          dilution: v.number(),
        }),
      ),
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),

  accords: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    childrenAccords: v.optional(v.array(v.id("accords"))),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
    materialsInFormula: v.optional(
      v.array(
        v.object({
          material: v.id("materials"),
          weight: v.number(),
          dilution: v.number(),
        }),
      ),
    ),
  })
    .index("by_user", ["userId"]),

  materials: defineTable({
    title: v.string(),
    userId: v.string(),
    category: v.object({
      name: v.string(),
      color: v.string(),
      isCustom: v.boolean(),
    }),
    isArchived: v.boolean(),
    cas: v.optional(v.string()),
    altName: v.optional(v.string()),
    fragrancePyramid: v.optional(v.string()),
    ifralimit: v.optional(v.number()),
    dilutions: v.optional(v.array(v.number())),
    dateObtained: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),

  categories: defineTable({
    name: v.string(),
    color: v.string(),
    isCustom: v.boolean(),
    userId: v.string(),
  }).index("by_user", ["userId"]),
});
