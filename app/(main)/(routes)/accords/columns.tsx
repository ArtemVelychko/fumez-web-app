"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

export type Material = {
  _id: Id<"materials">;
  title: string;
  category: { name: string; color: string; isCustom: boolean };
  cas?: string;
  fragrancePyramid?: string | undefined;
  dateObtained?: string;
};

export type ResponseType = FunctionReturnType<typeof api.materials.get>;

export const columns: ColumnDef<Material>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div className="flex justify-items-start items-center">
        Name
        <Button
          variant="ghost"
          className="ml-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const id = row.original._id;

      return <div>Lala</div>;
    },
  },
  {
    accessorKey: "category.color",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      if (!category) return null;

      const { name, color } = category;
      return (
        <div className="flex items-center space-x-2 text-xs">
          <HoverCard>
            <HoverCardTrigger>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm">{name}</HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "fragrancePyramid",
    header: "Fragrance Pyramid",
    cell: ({ row }) => {
      const pyramid = row.original.fragrancePyramid;
      if (!pyramid) return null;

      return (
        <div className="flex items-center space-x-2 text-xs">
          <HoverCard>
            <HoverCardTrigger>
              <div>
                <Image
                  alt="top note"
                  height="24"
                  width="24"
                  src="/pyramidTop.svg"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm">Top Note</HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <div>Lala</div>;
    },
  },
];
