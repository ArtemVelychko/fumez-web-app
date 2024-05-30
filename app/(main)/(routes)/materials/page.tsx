"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { columns } from "./columns";
import { DataTable } from "@/app/(main)/_components/data-table";
import { NewMaterialSheet } from "@/components/materials/new-material-sheet";
import { EditMaterialSheet } from "@/components/materials/edit-material-sheet";
import { useOnOpenMaterial } from "@/hooks/materials/use-on-open-material";

const DocumentsPage = () => {
  const materials = useQuery(api.materials.getSidebar);
  const { material } = useOnOpenMaterial();

  return (
    <div className="h-full flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 mt-14">
      {/* <MaterialList /> */}
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">My Materials</h1>
        <div className="ml-auto">
          {material && <EditMaterialSheet initialData={material} />}
          <NewMaterialSheet />
        </div>
      </div>

      {materials ? (
        <DataTable
          columns={columns}
          data={materials}
          filterKey="title"
          onDelete={() => {}}
        />
      ) : (
        <div>Loading...</div> // Render loading state if data is not yet loaded
      )}
    </div>
  );
};

export default DocumentsPage;
