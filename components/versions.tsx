// VersionsPanel.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface VersionsPanelProps {
  versions: string[];
  selectedVersion: string;
  onSelectVersion: (version: string) => void;
  onAddVersion: () => void;
}

export const VersionsPanel: React.FC<VersionsPanelProps> = ({
  versions,
  selectedVersion,
  onSelectVersion,
  onAddVersion,
}) => {
  return (
    <div className="flex flex-col items-center p-2 border rounded-lg mt-20">
      {versions.map((version, index) => (
        <Button
          key={version}
          variant={version === selectedVersion ? "outline" : "ghost"}
          size="sm"
          className="mb-2"
          onClick={() => onSelectVersion(version)}
        >
          v{index}
        </Button>
      ))}
      <Button variant="outline" size="icon" onClick={onAddVersion}>
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};
