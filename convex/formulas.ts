import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const formulas = await ctx.db
      .query("formulas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return formulas;
  },
});

export const archiveFormula = mutation({
  args: { id: v.id("formulas") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingFormula = await ctx.db.get(args.id);

    if (!existingFormula) {
      throw new Error("Accord not found");
    }

    if (existingFormula.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const formula = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    return formula;
  },
});

export const getFormulasSidebar = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const formulas = await ctx.db
      .query("formulas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return formulas;
  },
});

export const createFormula = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const formula = await ctx.db.insert("formulas", {
      title: args.title,
      userId,
      isArchived: false,
      isPublished: false,
      isBase: false,
      solvent: { name: "Solvent", weight: 0 },
    });

    return formula;
  },
});

export const getTrashFormulas = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const formulas = await ctx.db
      .query("formulas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return formulas;
  },
});

export const restoreFormula = mutation({
  args: { id: v.id("formulas") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingFormula = await ctx.db.get(args.id);

    if (!existingFormula) {
      throw new Error("Accord not found");
    }

    if (existingFormula.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const formula = await ctx.db.patch(args.id, {
      isArchived: false,
    });

    return formula;
  },
});

export const removeFormula = mutation({
  args: { id: v.id("formulas") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingFormula = await ctx.db.get(args.id);

    if (!existingFormula) {
      throw new Error("Accord not found");
    }

    if (existingFormula.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const formula = await ctx.db.delete(args.id);

    return formula;
  },
});

export const bulkRemoveFormulas = mutation({
  args: { ids: v.array(v.id("formulas")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    for (const id of args.ids) {
      const existingFormula = await ctx.db.get(id);

      if (!existingFormula) {
        throw new Error(`Accord with id ${id} not found`);
      }

      if (existingFormula.userId !== userId) {
        throw new Error(`Unauthorized to delete formula with id ${id}`);
      }

      await ctx.db.delete(id);
    }
  },
});

export const getSearchFormulas = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const formulas = await ctx.db
      .query("formulas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return formulas;
  },
});

export const getFormulaById = query({
  args: { formulaId: v.id("formulas") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const formula = await ctx.db.get(args.formulaId);

    if (!formula) {
      throw new Error("Accord not found");
    }

    if (formula.isPublished && !formula.isArchived) {
      return formula;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (formula.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return formula;
  },
});

export const updateFormula = mutation({
  args: {
    id: v.id("formulas"),
    title: v.optional(v.string()),
    note: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    isBase: v.optional(v.boolean()),
    materialsInFormula: v.optional(
      v.array(
        v.object({
          material: v.id("materials"),
          weight: v.number(),
          dilution: v.number(),
        }),
      ),
    ),
    accordsInFormula: v.optional(
      v.array(
        v.object({
          accord: v.id("accords"),
          weight: v.number(),
          dilution: v.number(),
        }),
      ),
    ),
    solvent: v.optional(v.object({ name: v.string(), weight: v.number() })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingFormula = await ctx.db.get(args.id);

    if (!existingFormula) {
      throw new Error("Not found");
    }

    if (existingFormula.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const formula = await ctx.db.patch(args.id, { ...rest });

    return formula;
  },
});
