import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  accords: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    isBase: v.boolean(),
    note: v.optional(v.string()),
    isPublished: v.boolean(),
    solvent: v.object({ name: v.string(), weight: v.number() }),
    materialsInFormula: v.optional(
      v.array(
        v.object({
          material: v.id("materials"),
          ifralimit: v.number(),
          weight: v.number(),
          dilution: v.number(),
        })
      )
    ),
    concentration: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  formulas: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    isBase: v.boolean(),
    note: v.optional(v.string()),
    isPublished: v.boolean(),
    solvent: v.object({ name: v.string(), weight: v.number() }),
    accordsInFormula: v.optional(
      v.array(
        v.object({
          accord: v.id("accords"),
          weight: v.number(),
          dilution: v.number(),
        })
      )
    ),
    materialsInFormula: v.optional(
      v.array(
        v.object({
          material: v.id("materials"),
          weight: v.number(),
          dilution: v.number(),
        })
      )
    ),
  }).index("by_user", ["userId"]),

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
    fragrancePyramid: v.optional(v.array(v.string())),
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
