import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  name: string;
  color: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Category[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
}) => (
  <div>
    <Label className="mb-1 block text-sm font-medium">{label}</Label>
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.name} value={option.name}>
            <div className="flex items-center">
              <span
                className="mr-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: option.color }}
              ></span>
              {option.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
