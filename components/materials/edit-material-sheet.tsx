import Image from "next/image";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnOpenMaterial } from "@/hooks/materials/use-on-open-material";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, MinusIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { categories } from "./categories";
import { useRouter } from "next/navigation";

type EditMaterialProps = {
  initialData: Doc<"materials">;
};

export const EditMaterialSheet = ({ initialData }: EditMaterialProps) => {
  const { isOpen, onClose } = useOnOpenMaterial();
  const router = useRouter();

  const onRedirect = (materialId: string) => {
    router.push(`/materials/${materialId}`);
  };

  const material = useQuery(api.materials.getById, {
    materialId: initialData._id,
  });

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
    material && (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right">
          <div className="flex h-full flex-col md:p-4">
            <div className="group relative">
              {/* Inputs */}
              <div className="space-y-1">
                <div>
                  <Label
                    htmlFor="title"
                    className="pt-2 mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                {/* Alt name field */}
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
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
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
                    // disabled={preview}
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
                      max={100}
                      value={`${formData.ifralimit}`}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "") {
                          handleInputChange("ifralimit", 0);
                        } else {
                          handleInputChange("ifralimit", Number(value));
                        }
                      }}
                      placeholder="IFRA Limit"
                      // disabled={preview}
                    />
                    <div className="absolute inset-y-0 right-5 flex items-center pr-3 pointer-events-none">
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>

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
                        onSelect={(date) =>
                          handleInputChange("dateObtained", date)
                        }
                        // disabled={preview}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="mb-5">
                  <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Description"
                    // disabled={preview}
                  />
                </div>
                <div className="flex mt-3 justify-end">
                  {/* <SheetClose>
                    <Button onClick={onClose}>Close</Button>
                  </SheetClose> */}
                  <Button onClick={() => onRedirect(material._id)}>
                    Go to material {"->"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  );
};
