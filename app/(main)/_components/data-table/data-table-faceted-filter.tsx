import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Column } from "@tanstack/react-table";
import type * as React from "react";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Array<{ name: string; color: string } | string>;
}

const pyramidLevels = [
  { value: "top", src: "/pyramid-top.svg", tooltip: "Top" },
  { value: "heart", src: "/pyramid-mid.svg", tooltip: "Heart" },
  { value: "base", src: "/pyramid-base.svg", tooltip: "Base" },
];

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 border-dashed" size="sm" variant="outline">
          <PlusCircle className="mr-2 size-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator className="mx-2 h-4" orientation="vertical" />
              <div className="flex space-x-1">
                {selectedValues.size > 2 ? (
                  <div className="flex items-center space-x-1">
                    <span>{selectedValues.size} selected</span>
                  </div>
                ) : (
                  options
                    .filter((option) => 
                      selectedValues.has(typeof option === 'string' ? option : option.name)
                    )
                    .map((option, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: typeof option === 'string' 
                            ? '#808080' // Default color for string options
                            : option.color 
                        }}
                      />
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => {
                const optionName = typeof option === 'string' ? option : option.name;
                const isSelected = selectedValues.has(optionName);
                return (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(optionName);
                      } else {
                        selectedValues.add(optionName);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {typeof option !== 'string' && (
                      <div
                        className="mr-2 w-4 h-4 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="capitalize">{optionName}</span>
                    {facets?.get(optionName) !== undefined ? (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                        {facets.get(optionName)}
                      </span>
                    ) : undefined}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="justify-center text-center"
                    onSelect={() => column?.setFilterValue(undefined)}
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
