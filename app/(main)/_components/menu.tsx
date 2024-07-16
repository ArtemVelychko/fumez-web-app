"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";

interface MenuProps {
  formulaId: Id<"formulas">;
}

export const Menu = ({ formulaId }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.formulas.archiveFormula);

  const onArchive = () => {
    const promise = archive({ id: formulaId });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash",
      error: "Failed to archive note",
    });

    router.push("/formulas");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DropdownMenuSeparator />
      <div className="text-xs text-muted-foreground p-2">
        Last edited by: {user?.fullName}
      </div>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return (
    <Skeleton className="h-10 w-10" />
  )
};
