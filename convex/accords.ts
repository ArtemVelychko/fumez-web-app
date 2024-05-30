import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const accords = await ctx.db
      .query("accords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return accords;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    cas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const rawMaterial = await ctx.db.insert("materials", {
      title: args.title,
      userId,
      isArchived: false,
      dilutions: [100],
      category: {
        name: "Uncategorized",
        color: "#808080",
        isCustom: false,
      },
    });

    return rawMaterial;
  },
});

export const createMaterial = mutation({
  args: {
    title: v.string(),
    category: v.object({
      name: v.string(),
      color: v.string(),
      isCustom: v.boolean(),
    }),
    description: v.optional(v.string()),
    altName: v.optional(v.string()),
    cas: v.optional(v.string()),
    fragrancePyramid: v.optional(v.string()),
    ifralimit: v.optional(v.number()),
    dilutions: v.optional(v.array(v.number())),
    dateObtained: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const newMaterial = {
      title: args.title,
      category: args.category,
      description: args.description || "",
      altName: args.altName || "",
      cas: args.cas || "",
      fragrancePyramid: args.fragrancePyramid || "",
      ifralimit: args.ifralimit || 0,
      dilutions: args.dilutions || [100],
      dateObtained: args.dateObtained || "",
      userId,
      isArchived: false,
    };
    const rawMaterial = await ctx.db.insert("materials", newMaterial);

    return rawMaterial;
  },
});

export const getById = query({
  args: { materialId: v.id("materials") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const rawMaterial = await ctx.db.get(args.materialId);

    if (!rawMaterial) {
      throw new Error("Document not found");
    }

    if (!rawMaterial.isArchived) {
      return rawMaterial;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (rawMaterial.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return rawMaterial;
  },
});

export const getSidebar = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const rawMaterials = await ctx.db
      .query("materials")
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return rawMaterials;
  },
});

export const remove = mutation({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Material not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const material = await ctx.db.delete(args.id);

    return material;
  },
});

export const update = mutation({
  args: {
    id: v.id("materials"),
    title: v.optional(v.string()),
    cas: v.optional(v.string()),
    category: v.optional(
      v.object({
        name: v.string(),
        color: v.string(),
        isCustom: v.boolean(),
      }),
    ),
    altName: v.optional(v.string()),
    fragrancePyramid: v.optional(v.string()),
    dilutions: v.optional(v.array(v.number())),
    dateObtained: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const material = await ctx.db.patch(args.id, { ...rest });

    return material;
  },
});

export const removeIcon = mutation({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const material = await ctx.db.patch(args.id, {
      icon: undefined,
    });

    return material;
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const material = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });

    return material;
  },
});

export const removeField = mutation({
  args: {
    id: v.id("materials"),
    field: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const allowedFields = ["cas", "altName"]; // Add more fields as needed
    if (!allowedFields.includes(args.field)) {
      throw new Error("Invalid field");
    }

    const updateData = {
      [args.field]: undefined,
    };

    const material = await ctx.db.patch(args.id, updateData);
    return material;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("materials")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});
