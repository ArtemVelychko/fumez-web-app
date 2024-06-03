import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusIcon, CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { FormEvent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";
import { categories } from "./categories";

// interface Category {
//   name: string;
//   color: string;
//   isCustom: boolean;
// }

interface FormData {
  title: string;
  category: {
    name: string;
    color: string;
    isCustom: boolean;
  };
  altName: string;
  cas: string;
  fragrancePyramid: string;
  ifralimit: number;
  dilutions: number[];
  dateObtained?: Date;
  description: string;
}

export const NewMaterialSheet = () => {
  const createMaterial = useMutation(api.materials.createMaterial);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: { name: "Uncategorized", color: "#808080", isCustom: false },
    altName: "",
    cas: "",
    fragrancePyramid: "",
    ifralimit: 0,
    dilutions: [],
    dateObtained: undefined,
    description: "",
  });

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCreateMaterial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newMaterial = {
      title: formData.title,
      category: formData.category,
      altName: formData.altName,
      cas: formData.cas,
      fragrancePyramid: formData.fragrancePyramid,
      ifralimit: formData.ifralimit,
      dilutions: [100, ...formData.dilutions], // Including 100 as the default dilution
      dateObtained: formData.dateObtained
        ? new Date(formData.dateObtained).toISOString()
        : undefined,
      description: formData.description,
    };
    const promise = createMaterial(newMaterial);
    toast.promise(promise, {
      loading: "Creating a new material...",
      success: "Material created successfully",
      error: "Failed to create material",
    });
    setFormData({
      title: "",
      category: { name: "Uncategorized", color: "#808080", isCustom: false },
      altName: "",
      cas: "",
      fragrancePyramid: "",
      ifralimit: 0,
      dilutions: [],
      dateObtained: undefined,
      description: "",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex h-full flex-col gap-4 p-4 md:p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Add New Material</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Fill out the form to add a new material to your collection.
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleCreateMaterial}>
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Material Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="pt-2 mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                Category
              </label>
              <Select
                onValueChange={(value) => {
                  const selectedCategory = categories.find(
                    (cat) => cat.name === value
                  );
                  if (selectedCategory) {
                    handleInputChange("category", selectedCategory);
                  }
                }}
                value={formData.category.name}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
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
            <div className="space-y-1">
              <Label htmlFor="altName">Alternative Name</Label>
              <Input
                id="altName"
                placeholder="Alternative Name"
                value={formData.altName}
                onChange={(e) => handleInputChange("altName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cas">CAS Number</Label>
              <Input
                id="cas"
                placeholder="CAS Number (e.g., 1234-56-7)"
                value={formData.cas}
                onChange={(e) => handleInputChange("cas", e.target.value)}
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
            <div className="space-y-1">
              <Label htmlFor="ifralimit">IFRA Limit</Label>
              <Input
                id="ifralimit"
                type="number"
                min={0}
                max={100}
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
              />
            </div>
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
            <div className="space-y-1">
              <Label htmlFor="dateObtained">Date Obtained</Label>
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
                      ? format(new Date(formData.dateObtained), "PPP")
                      : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => handleInputChange("dateObtained", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
            <div className="mt-auto flex justify-end gap-2">
              <SheetClose>
                <Button type="submit" size="sm">
                  Save
                </Button>
              </SheetClose>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
