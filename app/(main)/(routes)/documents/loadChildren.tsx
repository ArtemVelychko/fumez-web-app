import { TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export default function GetDocumentChildren({ documentId }: { documentId: Id<"documents"> }) {
  const children = useQuery(api.documents.getChildren, { parentDocumentId: documentId });

  if (!children) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {children.map((child) => (
        <TableRow key={child._id}>
          <TableCell>{child.title}</TableCell>
          <TableCell>{child.parentDocument}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
