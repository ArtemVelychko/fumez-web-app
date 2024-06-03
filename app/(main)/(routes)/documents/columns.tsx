import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Actions } from "./actions";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

export type Document = {
  _id: Id<"documents">;
  title: string;
  parentDocument?: Id<"documents">;
};

export type ResponseType = FunctionReturnType<typeof api.materials.get>;

export const columns: ColumnDef<Document>[] = [
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
    header: "Expand",
    cell: ({ row }) => (
      <div className="flex items-center">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" onClick={() => row.toggleExpanded()}>
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.getValue("title"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions id={row.original._id} />,
  },
];
