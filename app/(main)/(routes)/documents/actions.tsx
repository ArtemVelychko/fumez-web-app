import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useOnOpenMaterial } from "@/hooks/materials/use-on-open-material";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

type Props = {
  id: Id<"documents">;
};

export const Actions = ({ id }: Props) => {
  // const { onOpen } = useOnOpenMaterial();
  const remove = useMutation(api.documents.remove);
  const document = useQuery(api.documents.getById, { documentId: id });

  const handleDeleteMaterial = async (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });

    setTimeout(() => {
      toast.promise(promise, {
        loading: "Deleting material...",
        success: "Material deleted successfully",
        error: "Failed to delete a material",
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
            disabled={!document}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteMaterial(id)}>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
