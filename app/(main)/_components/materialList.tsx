"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Item } from "./Item";
import { cn } from "@/lib/utils";
import { MaterialItem } from "./materialItem";
import { FileIcon } from "lucide-react";

export const MaterialList = () => {
  const params = useParams();
  const router = useRouter();

  const materials = useQuery(api.materials.getSidebar);

  const onRedirect = (materialId: string) => {
    router.push(`/materials/${materialId}`);
  };

  if (materials === undefined) {
    return (
      <>
        <Item.Skeleton />
      </>
    );
  }

  return (
    <>
      {materials.map((material) => (
        <div key={material._id}>
          <MaterialItem
            id={material._id}
            onClick={() => onRedirect(material._id)}
            label={material.title}
            icon={FileIcon}
            documentIcon={material.icon}
            active={params.materialId === material._id}
          />
        </div>
      ))}
    </>
  );
};
