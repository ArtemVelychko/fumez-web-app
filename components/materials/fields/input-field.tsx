import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  error
}) => {
  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      <Label 
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full ${error ? 'border-destructive' : ''}`}
        />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};
