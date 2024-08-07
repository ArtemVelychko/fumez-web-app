import { ElementRef, useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { CirclePlusIcon, X } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import TextareaAutosize from "react-textarea-autosize";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";
import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Image from "next/image";

interface ToolbarProps {
  initialData: Doc<"accords">;
  preview?: boolean;
}

type MaterialInFormula = {
  material: Id<"materials">;
  weight: number;
  ifralimit: number;
  dilution: number;
};

const roundToThousandths = (num: number): number => {
  return Math.round(num * 1000) / 1000;
};

const pyramidLevels = [
  { value: "top", src: "/pyramid-top.svg", tooltip: "Top" },
  { value: "heart", src: "/pyramid-mid.svg", tooltip: "Heart" },
  { value: "base", src: "/pyramid-base.svg", tooltip: "Base" },
];

export const AccordPage = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const update = useMutation(api.accords.updateAccord);
  const materials = useQuery(api.materials.getSidebar);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);
  const [open, setOpen] = useState(false);
  const [scaleOpen, setScaleOpen] = useState(false);
  const [scaleValue, setScaleValue] = useState<string>("");
  const [dilutionScaleOpen, setDilutionScaleOpen] = useState(false);
  const [dilutionScaleValue, setDilutionScaleValue] = useState<string>("");
  const [solventWeight, setSolventWeight] = useState<number>(
    roundToThousandths(initialData.solvent?.weight || 0)
  );
  const [materialsInFormula, setMaterialsInFormula] = useState<
    MaterialInFormula[]
  >(
    (initialData.materialsInFormula ?? []).map((m) => ({
      ...m,
      weight: roundToThousandths(m.weight),
    }))
  );
  const [note, setNote] = useState(initialData.note || "");
  const [isBase, setIsBase] = useState(initialData.isBase);

  const materialsToAdd = materials?.filter(
    (material) => !materialsInFormula.some((m) => m.material === material._id)
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

  const addMaterial = (material: Doc<"materials">) => {
    if (materialsInFormula.some((m) => m.material === material._id)) {
      return;
    }

    setMaterialsInFormula([
      ...materialsInFormula,
      {
        material: material._id,
        weight: 0,
        ifralimit: material.ifralimit || 0,
        dilution: material.dilutions?.[0] || 100,
      },
    ]);
  };

  const updateMaterialWeight = (index: number, weight: number) => {
    const updatedMaterials = [...materialsInFormula];
    updatedMaterials[index].weight = roundToThousandths(weight);
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

  const totalMaterialWeight = roundToThousandths(
    materialsInFormula.reduce((sum, material) => sum + material.weight, 0)
  );

  const totalWeight = roundToThousandths(totalMaterialWeight + solventWeight);

  const finalDilution =
    totalWeight > 0
      ? roundToThousandths(
          (materialsInFormula.reduce(
            (sum, material) =>
              sum + material.weight * (material.dilution / 100),
            0
          ) /
            totalWeight) *
            100
        )
      : 0;

  const scaleFormula = (newTotalWeight: number) => {
    const scalingFactor = newTotalWeight / totalWeight;
    const scaledMaterials = materialsInFormula.map((material) => ({
      ...material,
      weight: roundToThousandths(material.weight * scalingFactor),
    }));
    setMaterialsInFormula(scaledMaterials);
    setSolventWeight(roundToThousandths(solventWeight * scalingFactor));
  };

  const handleScaleSubmit = () => {
    const newTotalWeight = parseFloat(scaleValue);
    if (!isNaN(newTotalWeight) && newTotalWeight > 0) {
      scaleFormula(newTotalWeight);
      setScaleOpen(false);
      setScaleValue("");
    }
  };

  const scaleFormulaByDilution = (desiredDilution: number) => {
    const totalMaterialDilutionWeight = materialsInFormula.reduce(
      (sum, material) => sum + material.weight * (material.dilution / 100),
      0
    );
    const requiredTotalWeight =
      totalMaterialDilutionWeight / (desiredDilution / 100);
    const requiredSolventWeight = roundToThousandths(
      requiredTotalWeight - totalMaterialWeight
    );

    if (requiredSolventWeight < 0) {
      alert(
        "Not possible to scale to the desired dilution. Adjust material dilutions."
      );
      return;
    }

    setSolventWeight(requiredSolventWeight);
  };

  const handleDilutionScaleSubmit = () => {
    const newDilution = parseFloat(dilutionScaleValue);
    if (!isNaN(newDilution) && newDilution > 0 && newDilution <= 100) {
      scaleFormulaByDilution(newDilution);
      setDilutionScaleOpen(false);
      setDilutionScaleValue("");
    } else {
      alert("Please enter a valid dilution percentage (1-100).");
    }
  };

  const updateNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    update({
      id: initialData._id,
      note: e.target.value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsBase(checked);
    update({
      id: initialData._id,
      isBase: checked,
    });
  };

  useEffect(() => {
    update({
      id: initialData._id,
      materialsInFormula: materialsInFormula,
      solvent: { ...initialData.solvent, weight: solventWeight },
      concentration: finalDilution,
    });
  }, [
    update,
    initialData._id,
    materialsInFormula,
    solventWeight,
    initialData.solvent,
    finalDilution,
  ]);

  const calculatePureMaterialWeight = (weight: number, dilution: number) => {
    return roundToThousandths(weight * (dilution / 100));
  };

  const ifraCompliant = (material: MaterialInFormula, totalWeight: number) => {
    const pureMaterialWeight = calculatePureMaterialWeight(
      material.weight,
      material.dilution
    );
    const pureMaterialPercentage = roundToThousandths(
      (pureMaterialWeight / totalWeight) * 100
    );

    if (material.ifralimit === 0) return true;

    return pureMaterialPercentage <= material.ifralimit;
  };

  const [sortConfig, setSortConfig] = useState<{
    key: "note" | "name" | "percentage";
    direction: "ascending" | "descending";
  } | null>(null);

  return (
    <div className="pl-4 group relative flex">
      <div className="flex-1 ml-4 mt-20">
        <div className="flex items-center justify-between">
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
              className="pb-2 text-3xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
            >
              {initialData.title}
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="isBaseSwitch"
                className={cn(isBase && "text-secondary")}
              >
                Accord
              </Label>
              <Switch
                id="isBaseSwitch"
                checked={isBase}
                onCheckedChange={handleSwitchChange}
              />
              <Label
                htmlFor="isBaseSwitch"
                className={cn(!isBase && "text-secondary")}
              >
                Base
              </Label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {materialsInFormula.length > 0 && (
            <div className="border shadow-sm rounded-md">
              <div className="relative w-full overflow-auto">
                <Table className="w-full caption-bottom text-sm">
                  <TableHeader className="[&>tr]:border-b">
                    <TableRow className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Note
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Material
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Weight (g)
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Concentration
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Percentage
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        {/* Actions */}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="[&>tr:last-child]:border-0">
                    {materialsInFormula.map((selectedMaterial, index) => {
                      const material = materials?.find(
                        (m) => m._id === selectedMaterial.material
                      );
                      const isCompliant = ifraCompliant(
                        selectedMaterial,
                        totalWeight
                      );

                      if (!material) {
                        return null;
                      }

                      const pyramidValues = material.fragrancePyramid || [];
                      const selectedLevels = pyramidLevels.filter((level) =>
                        pyramidValues.includes(level.value)
                      );

                      const tooltipText =
                        selectedLevels
                          .map((level) => level.tooltip)
                          .join(" / ") + " Note";

                      return (
                        <TableRow
                          key={selectedMaterial.material}
                          className={cn(
                            "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                            { "bg-red-100": !isCompliant }
                          )}
                        >
                          <TableCell className="text-sm p-4 align-middle">
                            {pyramidValues.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <HoverCard>
                                  <HoverCardTrigger>
                                    <div className="flex items-center space-x-1">
                                      {selectedLevels.map((level, index) => (
                                        <div key={index} className="size-5">
                                          <Image
                                            alt={tooltipText}
                                            height={24}
                                            width={24}
                                            src={level.src}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </HoverCardTrigger>
                                  <HoverCardContent className="text-sm">
                                    {tooltipText}
                                  </HoverCardContent>
                                </HoverCard>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm p-4 align-middle">
                            <div className="flex items-center">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <div>{material.title}</div>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <div>
                                    <span className="font-bold">
                                    {material.title}
                                    </span>
                                    <div className="flex items-center mt-2 ml-1">
                                      <span
                                        className="mr-1 h-2 w-2 rounded-full"
                                        style={{
                                          backgroundColor:
                                            material.category.color,
                                        }}
                                      ></span>
                                      <span
                                        className="text-sm font-semibold"
                                        style={{
                                          color: material.category.color,
                                        }}
                                      >
                                        {material.category.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center mt-2 ml-1">
                                      {material.description && (
                                        <span className="text-sm">
                                          {material.description}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm p-4 align-middle">
                            <Input
                              type="number"
                              value={`${selectedMaterial.weight}`}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*\.?\d*$/.test(value)) {
                                  updateMaterialWeight(
                                    index,
                                    value === "" ? 0 : Number(value)
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-sm p-4 align-middle">
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
                                  <SelectItem
                                    key={dilution}
                                    value={`${dilution}`}
                                  >
                                    {dilution}%
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm p-4 align-middle">
                            {totalWeight > 0
                              ? (
                                  (selectedMaterial.weight / totalWeight) *
                                  100
                                ).toFixed(2)
                              : 0}
                            %
                          </TableCell>
                          <TableCell className="p-4 align-middle">
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
                      <TableCell></TableCell>
                      <TableCell className="text-sm font-medium">
                        <div className="flex items-center">
                          {initialData.solvent?.name || "Solvent"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <Input
                          type="number"
                          value={`${solventWeight}`}
                          min={0}
                          onChange={(e) =>
                            setSolventWeight(Number(e.target.value))
                          }
                        />
                      </TableCell>
                      <TableCell className="text-sm font-medium"></TableCell>
                      <TableCell className="text-sm">
                        {totalWeight > 0
                          ? ((solventWeight / totalWeight) * 100).toFixed(2)
                          : 0}
                        %
                      </TableCell>
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell className="text-sm font-bold">Final</TableCell>
                      <TableCell className="text-sm">
                        <Dialog open={scaleOpen} onOpenChange={setScaleOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-bold"
                              disabled={totalWeight === 0}
                            >
                              {totalWeight} g
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[225px]">
                            <DialogHeader>
                              <DialogTitle>Scale Formula</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col space-y-4">
                              <label htmlFor="scaleInput" className="text-sm">
                                Scale formula to total weight (g):
                              </label>
                              <Input
                                id="scaleInput"
                                type="number"
                                value={scaleValue}
                                onChange={(e) => setScaleValue(e.target.value)}
                                className="w-full"
                              />
                              <div className="flex justify-between">
                                <DialogClose asChild>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                  >
                                    Close
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="button"
                                  onClick={handleScaleSubmit}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Scale
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-sm">
                        <Dialog
                          open={dilutionScaleOpen}
                          onOpenChange={setDilutionScaleOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-bold"
                              disabled={totalMaterialWeight === 0}
                            >
                              {finalDilution.toFixed(2)}%
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[225px]">
                            <DialogHeader>
                              <DialogTitle>
                                Scale to final concentration (%):
                              </DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col space-y-4">
                              <Input
                                id="dilutionScaleInput"
                                type="number"
                                min={0}
                                value={dilutionScaleValue}
                                onChange={(e) =>
                                  setDilutionScaleValue(e.target.value)
                                }
                                className="w-full"
                              />
                              <div className="flex justify-between">
                                <DialogClose asChild>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                  >
                                    Close
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="button"
                                  onClick={handleDilutionScaleSubmit}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Scale
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-sm font-bold">100%</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Add Material */}
          {!preview && (
            <div className="mt-4 flex gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild onTouchStart={() => setOpen(!open)}>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    <div className="flex justify-center items-center">
                      <CirclePlusIcon className="size-4 mr-2" />
                      add material
                    </div>
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

          {/* Note */}
          <div className="grid w-full gap-1.5 mt-4">
            <Label htmlFor="message">Note:</Label>
            <Textarea
              placeholder="Add a note to your formula..."
              id="message"
              value={note}
              onChange={updateNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
