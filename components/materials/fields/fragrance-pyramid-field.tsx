import React from 'react';
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const pyramidLevels = [
  { value: "top", src: "/pyramid-top.svg", tooltip: "Top Note" },
  { value: "heart", src: "/pyramid-mid.svg", tooltip: "Mid Note" },
  { value: "base", src: "/pyramid-base.svg", tooltip: "Base Note" },
];

interface FragrancePyramidFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const FragrancePyramidField: React.FC<FragrancePyramidFieldProps> = ({
  value,
  onChange,
}) => (
  <div>
    <Label className="mb-1 block text-sm font-medium">Fragrance pyramid</Label>
    <div className="flex gap-x-1">
      <ToggleGroup type="multiple" value={value} onValueChange={onChange}>
        {pyramidLevels.map((level) => (
          <ToggleGroupItem key={level.value} value={level.value}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="size-5">
                    <Image
                      alt={level.tooltip}
                      height={24}
                      width={24}
                      src={level.src}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>{level.tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  </div>
);
