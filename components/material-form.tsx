"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon, CalendarIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import Image from "next/image";

const categories = [
  { name: "Uncategorized", color: "#808080", isCustom: false },
  { name: "Aldehydic", color: "#E6E6FA", isCustom: false },
  { name: "Amber", color: "#FFBF00", isCustom: false },
  { name: "Animalic", color: "#A0522D", isCustom: false },
  { name: "Aquatic", color: "#00FFFF", isCustom: false },
  { name: "Aromatic", color: "#9370DB", isCustom: false },
  { name: "Balsamic", color: "#C2B280", isCustom: false },
  { name: "Citrus", color: "#FFA500", isCustom: false },
  { name: "Earthy", color: "#CD853F", isCustom: false },
  { name: "Floral", color: "#FF69B4", isCustom: false },
  { name: "Fruity", color: "#FF6347", isCustom: false },
  { name: "Gourmand", color: "#D2691E", isCustom: false },
  { name: "Green", color: "#008000", isCustom: false },
  { name: "Herbal", color: "#228B22", isCustom: false },
  { name: "Leather", color: "#8B0000", isCustom: false },
  { name: "Mossy", color: "#556B2F", isCustom: false },
  { name: "Musky", color: "#800080", isCustom: false },
  { name: "Ozonic", color: "#87CEFA", isCustom: false },
  { name: "Powdery/Sweet", color: "#FFC0CB", isCustom: false },
  { name: "Resinous", color: "#B8860B", isCustom: false },
  { name: "Spicy", color: "#B22222", isCustom: false },
  { name: "Tobacco/Hay", color: "#D2691E", isCustom: false },
  { name: "Woody", color: "#8B4513", isCustom: false },
];

interface MaterialFormProps {
  initialData: Doc<"materials">;
  preview?: boolean;
}

export const MaterialForm = ({ initialData, preview }: MaterialFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData.title,
    category: initialData.category,
    cas: initialData.cas || "",
    altName: initialData.altName || "",
    ifralimit: initialData.ifralimit || 0,
    dilutions: initialData.dilutions?.slice(1) || [],
    fragrancePyramid: initialData.fragrancePyramid || "",
    dateObtained: initialData.dateObtained
      ? new Date(initialData.dateObtained).toISOString()
      : undefined,
    description: initialData.description || "",
  });

  const update = useMutation(api.materials.update);

  const handleInputChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    if (field === "dilutions") {
      const updatedDilutions = [100, ...(value as number[])];
      update({
        id: initialData._id,
        dilutions: updatedDilutions,
      });
    } else if (field === "dateObtained") {
      const dateValue = value instanceof Date ? value.toISOString() : undefined;
      update({
        id: initialData._id,
        dateObtained: dateValue,
      });
    } else if (field === "category") {
      const selectedCategory = categories.find(
        (category) => category.name === value
      );
      setFormData((prevData) => ({
        ...prevData,
        category: selectedCategory || prevData.category,
      }));
      update({
        id: initialData._id,
        category: selectedCategory,
      });
    } else {
      update({
        id: initialData._id,
        [field]: value,
      });
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6 mt-16">
      <div className="pl-4 group relative">
        {/* Inputs */}
        <div className="space-y-4 mt-8">
          <div>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none border-none  focus-visible:ring-0"
              disabled={preview}
            />
          </div>

          {/* <div>
                <Input
                  value={formData.altName}
                  onChange={(e) => handleInputChange("altName", e.target.value)}
                  placeholder="Alternative name"
                  disabled={preview}
                  className="text-1xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none border-none  focus-visible:ring-0"
                />
              </div> */}

          <div>
            <label className="pt-2 mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Category
            </label>
            <Select
              onValueChange={(value) => handleInputChange("category", value)}
              value={formData.category.name}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    <div className="flex items-center">
                      <span
                        className="mr-2 h-2 w-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              CAS Number
            </label>

            {/* Need to add a new component for OTP input */}

            <Input
              value={formData.cas}
              onChange={(e) => handleInputChange("cas", e.target.value)}
              placeholder="CAS Number (e.g., 1234-56-7)"
              disabled={preview}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Fragrance pyramid
            </label>
            <div className="flex gap-x-1">
              <ToggleGroup
                type="single"
                onValueChange={(value) =>
                  handleInputChange("fragrancePyramid", value)
                }
                value={formData.fragrancePyramid}
              >
                <ToggleGroupItem value="top">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="size-5">
                          <Image
                            alt="top note"
                            height="24"
                            width="24"
                            src="/pyramidTop.svg"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Top Note</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </ToggleGroupItem>

                <ToggleGroupItem value="heartTop">
                  <div className="size-5">
                    <Image
                      alt="heart top"
                      height="24"
                      width="24"
                      src="/pyramidMidTop.svg"
                    />
                  </div>
                </ToggleGroupItem>

                <ToggleGroupItem value="heart">
                  <div className="size-5">
                    <Image
                      alt="heart top"
                      height="24"
                      width="24"
                      src="/pyramidMid.svg"
                    />
                  </div>
                </ToggleGroupItem>

                <ToggleGroupItem value="baseHeart">
                  <div className="size-5">
                    <Image
                      alt="heart top"
                      height="24"
                      width="24"
                      src="/pyramidBaseMid.svg"
                    />
                  </div>
                </ToggleGroupItem>

                <ToggleGroupItem value="base">
                  <div className="size-5">
                    <Image
                      alt="heart top"
                      height="24"
                      width="24"
                      src="/pyramidBase.svg"
                    />
                  </div>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              IFRA Limit
            </label>
            <div className="relative flex-1">
              <Input
                type="number"
                min={0}
                max={99}
                value={formData.ifralimit || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "") {
                    handleInputChange("ifralimit", 0);
                  } else {
                    handleInputChange("ifralimit", Number(value));
                  }
                }}
                placeholder="IFRA Limit"
                disabled={preview}
              />
              <div className="absolute inset-y-0 right-5 flex items-center pr-3 pointer-events-none">
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between">
            {/* Dilutions */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                My Dilutions
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex flex-col gap-y-2">
                    {/* Original Dilution */}
                    <div className="flex items-center">
                      <div className="relative flex-1">
                        <Input type="number" value={100} disabled />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-sm text-muted-foreground">
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Dilutions */}
                    {formData.dilutions.map((dilution, index) => (
                      <div key={index} className="flex items-center">
                        <div className="relative flex-1">
                          <Input
                            type="number"
                            placeholder="Dilution"
                            min={0}
                            max={100}
                            value={dilution}
                            onChange={(e) => {
                              const newDilutions = [...formData.dilutions];
                              newDilutions[index] = Number(e.target.value);
                              handleInputChange("dilutions", newDilutions);
                            }}
                            // disabled={preview}
                            className="-webkit-inner-spin-button: pr-8"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newDilutions = [...formData.dilutions];
                            newDilutions.splice(index, 1);
                            handleInputChange("dilutions", newDilutions);
                          }}
                          className="ml-2"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {/* Add Dilution Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDilutions = [...formData.dilutions, 10];
                        handleInputChange("dilutions", newDilutions);
                      }}
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Add Dilution
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Obtained */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                Date Obtained
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !formData.dateObtained && "text-muted-foreground"
                    )}
                  >
                    {formData.dateObtained
                      ? format(formData.dateObtained, "PPP")
                      : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => handleInputChange("dateObtained", date)}
                    disabled={preview}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description"
              disabled={preview}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
