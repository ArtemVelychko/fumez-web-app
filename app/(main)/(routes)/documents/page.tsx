"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { DocumentList } from "../../_components/documentList";
import { useNewMaterial } from "@/hooks/use-new-material";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { DataTable } from "@/app/(main)/_components/data-table";
import { columns } from "./columns";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

const DocumentsPage = ({ parentDocumentId }: DocumentListProps) => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);
  const { onOpen } = useNewMaterial();

  const onCreate = () => {
    const promise = create({ title: "Untitled" });

    toast.promise(promise, {
      loading: "Creating a new formula...",
      success: "Formula created successfully",
      error: "Failed to create formula",
    });
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <DocumentList />
      {documents ? (
        <DataTable
          columns={columns}
          data={documents}
          filterKey="title"
          onDelete={() => {}}
        />
      ) : (
        <div>Loading...</div> // Render loading state if data is not yet loaded
      )}

      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a formula
      </Button>
    </div>
  );
};

export default DocumentsPage;
