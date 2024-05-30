"use client";

import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

import { MaterialForm } from "@/components/material-form";

interface MaterialIdPageProps {
  params: {
    materialId: Id<"materials">;
  };
}

const DocumentIdPage = ({ params }: MaterialIdPageProps) => {
  const material = useQuery(api.materials.getById, {
    materialId: params.materialId,
  });

  if (material === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (material === null) {
    return <div>Document not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={material.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <MaterialForm initialData={material} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
