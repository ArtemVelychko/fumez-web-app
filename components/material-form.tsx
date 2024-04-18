"use client";

import { ElementRef, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";
import {
  X,
  Smile,
  ImageIcon,
  PlusIcon,
  MinusIcon,
  CalendarIcon,
} from "lucide-react";
import { useMutation } from "convex/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MaterialFormProps {
  initialData: Doc<"materials">;
  preview?: boolean;
}

export const MaterialForm = ({ initialData, preview }: MaterialFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData.title,
    cas: initialData.cas || "",
    altName: initialData.altName || "",
    ifralimit: initialData.ifralimit || 0,
    dilutions: initialData.dilutions?.slice(1) || [],
    dateObtained: initialData.dateObtained
      ? new Date(initialData.dateObtained)
      : null,
    description: initialData.description || "",
  });

  const removeIcon = useMutation(api.materials.removeIcon);
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
    } else {
      update({
        id: initialData._id,
        [field]: value,
      });
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

  return (
    <div className="pl-[54px] group relative">
      {/* Icon */}
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-76 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
      </div>

      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] border-none"
            disabled={preview}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            CAS Number
          </label>
          <input
            value={formData.cas}
            onChange={(e) => handleInputChange("cas", e.target.value)}
            placeholder="CAS Number (e.g., 1234-56-7)"
            disabled={preview}
            className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Alt Name
          </label>
          <input
            value={formData.altName}
            onChange={(e) => handleInputChange("altName", e.target.value)}
            placeholder="Alt Name"
            disabled={preview}
            className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            IFRA Limit
          </label>
          <input
            type="number"
            min={0}
            max={99}
            value={formData.ifralimit}
            onChange={(e) =>
              handleInputChange("ifralimit", Number(e.target.value))
            }
            placeholder="IFRA Limit"
            disabled={preview}
            className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        {/* Dilutions */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Dilutions
          </label>
          <div className="flex flex-col gap-y-2">
            {/* Original Dilution */}
            <div className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={100}
                  disabled
                  className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            {/* Additional Dilutions */}
            {formData.dilutions.map((dilution, index) => (
              <div key={index} className="flex items-center">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Dilution"
                    max={100}
                    value={dilution}
                    onChange={(e) => {
                      const newDilutions = [...formData.dilutions];
                      newDilutions[index] = Number(e.target.value);
                      handleInputChange("dilutions", newDilutions);
                    }}
                    disabled={preview}
                    className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                {!preview && (
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
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {/* Add Dilution Button */}
            {!preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDilutions = [...formData.dilutions, 0];
                  handleInputChange("dilutions", newDilutions);
                }}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Dilution
              </Button>
            )}
          </div>
        </div>

        {/* Date Obtained */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Date Obtained
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
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
                selected={formData.dateObtained ?? undefined}
                onSelect={(date) => handleInputChange("dateObtained", date)}
                disabled={preview}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Description"
            disabled={preview}
            className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
