"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Item } from "./Item";
import { MaterialItem2 } from "./materialItem2";
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
          <MaterialItem2
            id={material._id}
            onClick={() => onRedirect(material._id)}
            label={material.title}
            category={material.category}
            icon={FileIcon}
            documentIcon={material.icon}
            active={params.materialId === material._id}
          />
        </div>
      ))}
    </>
  );
};
