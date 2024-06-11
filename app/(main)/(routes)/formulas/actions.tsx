import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

type Props = {
  id: Id<"formulas">;
};

export const Actions = ({ id }: Props) => {
  const remove = useMutation(api.formulas.removeFormula);
  const formula = useQuery(api.formulas.getFormulaById, { formulaId: id });
  const router = useRouter();

  const onRedirect = (formulaId: string) => {
    router.push(`/formulas/${formulaId}`);
  };

  const handleDeleteFormula = async (formulaId: Id<"formulas">) => {
    const promise = remove({ id: formulaId });

    setTimeout(() => {
      toast.promise(promise, {
        loading: "Deleting formula...",
        success: "Formula deleted successfully",
        error: "Failed to delete formula",
      });
    }, 200);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={!formula}
            onClick={() => onRedirect(id)}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteFormula(id)}>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
