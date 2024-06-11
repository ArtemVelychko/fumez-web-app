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
  id: Id<"accords">;
};

export const Actions = ({ id }: Props) => {
  const remove = useMutation(api.accords.removeAccord);
  const accord = useQuery(api.accords.getAccordById, { accordId: id });
  const router = useRouter();

  const onRedirect = (accordId: string) => {
    router.push(`/acccords/${accordId}`);
  };

  const handleDeleteAccord = async (accordId: Id<"accords">) => {
    const promise = remove({ id: accordId });

    setTimeout(() => {
      toast.promise(promise, {
        loading: "Deleting accord...",
        success: "Accord deleted successfully",
        error: "Failed to delete a accord",
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
            disabled={!accord}
            onClick={() => onRedirect(id)}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteAccord(id)}>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
