import { Id } from "@/convex/_generated/dataModel";

export interface MaterialInFormula {
  material: Id<"materials">;
  weight: number;
  dilution: number;
  title: string;
  dilutions?: number[];
}

export interface AccordInFormula {
  accord: Id<"accords">;
  weight: number;
  dilution: number;
  title: string;
  concentration: number;
}