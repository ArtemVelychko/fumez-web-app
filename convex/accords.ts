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

export const archiveAccord = mutation({
  args: { id: v.id("accords") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingAccord = await ctx.db.get(args.id);

    if (!existingAccord) {
      throw new Error("Accord not found");
    }

    if (existingAccord.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const accord = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    return accord;
  },
});

export const getAccordsSidebar = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const accords = await ctx.db
      .query("accords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return accords;
  },
});

export const createAccord = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const accord = await ctx.db.insert("accords", {
      title: args.title,
      userId,
      isArchived: false,
      isPublished: false,
      isBase: false,
      solvent: { name: "Solvent", weight: 0 },
    });

    return accord;
  },
});

export const getTrashAccords = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const accords = await ctx.db
      .query("accords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return accords;
  },
});

export const restoreAccord = mutation({
  args: { id: v.id("accords") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingAccord = await ctx.db.get(args.id);

    if (!existingAccord) {
      throw new Error("Accord not found");
    }

    if (existingAccord.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const accord = await ctx.db.patch(args.id, {
      isArchived: false,
    });

    return accord;
  },
});

export const removeAccord = mutation({
  args: { id: v.id("accords") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingAccord = await ctx.db.get(args.id);

    if (!existingAccord) {
      throw new Error("Accord not found");
    }

    if (existingAccord.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const accord = await ctx.db.delete(args.id);

    return accord;
  },
});

export const bulkRemoveAccords = mutation({
  args: { ids: v.array(v.id("accords")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    for (const id of args.ids) {
      const existingAccord = await ctx.db.get(id);

      if (!existingAccord) {
        throw new Error(`Accord with id ${id} not found`);
      }

      if (existingAccord.userId !== userId) {
        throw new Error(`Unauthorized to delete accord with id ${id}`);
      }

      await ctx.db.delete(id);
    }
  },
});

export const getSearchAccords = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const accords = await ctx.db
      .query("accords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return accords;
  },
});

export const getAccordById = query({
  args: { accordId: v.id("accords") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const accord = await ctx.db.get(args.accordId);

    if (!accord) {
      throw new Error("Accord not found");
    }

    if (accord.isPublished && !accord.isArchived) {
      return accord;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (accord.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return accord;
  },
});

export const updateAccord = mutation({
  args: {
    id: v.id("accords"),
    title: v.optional(v.string()),
    note: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    isBase: v.optional(v.boolean()),
    materialsInFormula: v.optional(
      v.array(
        v.object({
          material: v.id("materials"),
          weight: v.number(),
          ifralimit: v.number(),
          dilution: v.number(),
        }),
      ),
    ),
    solvent: v.optional(v.object({ name: v.string(), weight: v.number() })),
    concentration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingAccord = await ctx.db.get(args.id);

    if (!existingAccord) {
      throw new Error("Not found");
    }

    if (existingAccord.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const accord = await ctx.db.patch(args.id, { ...rest });

    return accord;
  },
});

export const duplicateAccord = mutation({
  args: { id: v.id("accords") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingAccord = await ctx.db.get(args.id);

    if (!existingAccord) {
      throw new Error("Accord not found");
    }

    if (existingAccord.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Create a new object without _id and createdAt
    const { _id, _creationTime, ...accordDataToCopy } = existingAccord;

    const newAccord = {
      ...accordDataToCopy,
      title: `${existingAccord.title} (copy)`,
      isArchived: false,
      isPublished: false,
      userId, // Ensure the new accord is associated with the current user
    };

    const duplicatedAccord = await ctx.db.insert("accords", newAccord);

    return duplicatedAccord;
  },
});
