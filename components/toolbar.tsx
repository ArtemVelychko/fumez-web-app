"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";
import { X, Smile, ImageIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);
  const removeIcon = useMutation(api.documents.removeIcon);
  const update = useMutation(api.documents.update);
  const coverImage = useCoverImage();

  const [open, setOpen] = useState(false);

  const materials = useQuery(api.materials.getSidebar);
  const [materialsInFormula, setMaterialsInFormula] = useState<
    {
      material: Id<"materials">;
      weight: number;
      dilution: number;
    }[]
  >(initialData.materialsInFormula ?? []);

  const materialsToAdd = materials?.filter(
    (material) => !materialsInFormula.some((m) => m.material === material._id),
  );

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    });
  };

  const addMaterial = (material: Doc<"materials">) => {
    if (materialsInFormula.some((m) => m.material === material._id)) {
      return;
    }

    setMaterialsInFormula([
      ...materialsInFormula,
      {
        material: material._id,
        weight: 0,
        dilution: material.dilutions?.[0] || 100,
      },
    ]);
  };

  const updateMaterialWeight = (index: number, weight: number) => {
    const updatedMaterials = [...materialsInFormula];
    updatedMaterials[index].weight = weight;
    setMaterialsInFormula(updatedMaterials);
  };

  const updateMaterialDilution = (index: number, dilution: number) => {
    const updatedMaterials = [...materialsInFormula];
    updatedMaterials[index].dilution = dilution;
    setMaterialsInFormula(updatedMaterials);
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = [...materialsInFormula];
    updatedMaterials.splice(index, 1);
    setMaterialsInFormula(updatedMaterials);
  };

  const totalWeight = materialsInFormula.reduce(
    (sum, selectedMaterial) => sum + selectedMaterial.weight,
    0,
  );

  const finalDilution =
    materialsInFormula.reduce(
      (sum, selectedMaterial) =>
        sum + selectedMaterial.weight * selectedMaterial.dilution,
      0,
    ) / totalWeight;

  const sortMaterials = (key: keyof (typeof materialsInFormula)[0]) => {
    const sortedMaterials = [...materialsInFormula].sort((a, b) => {
      if (key === "material") {
        const materialA = materials?.find((m) => m._id === a.material);
        const materialB = materials?.find((m) => m._id === b.material);
        return (materialA?.title || "").localeCompare(materialB?.title || "");
      } else {
        return a[key] - b[key];
      }
    });
    setMaterialsInFormula(sortedMaterials);
  };

  useEffect(() => {
    update({
      id: initialData._id,
      materialsInFormula: materialsInFormula,
    });
  }, [update, initialData._id, materialsInFormula]);

  return (
    <div className="pl-4 group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-4">
          <IconPicker onChange={onIconSelect}>
            <p className="text-4xl hover:opacity-76 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-4xl pt-4">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-2">
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-3 w-3 mr-1" />
            Add cover
          </Button>
        )}
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-3 w-3 mr-1" />
              Add icon
            </Button>
          </IconPicker>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-3xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-2 text-3xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] "
        >
          {initialData.title}
        </div>
      )}

      <div className="mt-4">
        {materialsInFormula.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer text-xs"
                  onClick={() => sortMaterials("material")}
                >
                  Material
                </TableHead>
                <TableHead
                  className="cursor-pointer text-xs"
                  onClick={() => sortMaterials("weight")}
                >
                  Weight (g)
                </TableHead>
                <TableHead className="text-xs">Dilution</TableHead>
                <TableHead
                  className="cursor-pointer text-xs"
                  onClick={() => sortMaterials("dilution")}
                >
                  Percentage
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialsInFormula.map((selectedMaterial, index) => {
                const material = materials?.find(
                  (m) => m._id === selectedMaterial.material,
                );

                if (!material) {
                  return null;
                }

                return (
                  <TableRow key={selectedMaterial.material}>
                    <TableCell className="text-sm">
                      <div className="flex items-center">
                        <span
                          className="mr-2 h-2 w-2 rounded-full"
                          style={{ backgroundColor: material.category.color }}
                        ></span>
                        <HoverCard>
                          <HoverCardTrigger>{material.title}</HoverCardTrigger>
                          <HoverCardContent className="text-2xl">
                            {material.title}
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <Input
                        type="number"
                        value={selectedMaterial.weight}
                        onChange={(e) =>
                          updateMaterialWeight(index, Number(e.target.value))
                        }
                      />
                    </TableCell>
                    <TableCell className="text-sm">
                      <Select
                        value={`${selectedMaterial.dilution}`}
                        onValueChange={(value) =>
                          updateMaterialDilution(index, Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {material.dilutions?.map((dilution) => (
                            <SelectItem key={dilution} value={`${dilution}`}>
                              {dilution}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">
                      {((selectedMaterial.weight / totalWeight) * 100).toFixed(
                        2,
                      )}
                      %
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeMaterial(index)}
                        className="rounded-full opacity-100 transition text-muted-foreground text-xs"
                        variant="outline"
                        size="icon"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell className="text-sm font-medium">Total</TableCell>
                <TableCell className="text-sm">{totalWeight}g</TableCell>
                <TableCell className="text-sm">
                  {finalDilution.toFixed(2)}%
                </TableCell>
                <TableCell className="text-sm">100%</TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        )}

        {/* Add Material */}
        {!preview && (
          <div className="mt-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                asChild
                // onClick={() => setOpen(!open)}
                onTouchStart={() => setOpen(!open)}
              >
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  + add material
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search material..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No materials found.</CommandEmpty>
                    <CommandGroup heading="Materials">
                      {materialsToAdd?.map((material) => {
                        const { _id, title, category } = material;

                        return (
                          <CommandItem
                            key={_id}
                            value={title}
                            onSelect={() => {
                              const selectedMaterial =
                                materials?.find((m) => m._id === _id) ?? null;
                              if (selectedMaterial) {
                                addMaterial(selectedMaterial);
                                setOpen(false);
                              }
                            }}
                          >
                            <span
                              className="mr-2 h-2 w-2 rounded-full"
                              style={{ backgroundColor: category.color }}
                            ></span>
                            {title}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};
