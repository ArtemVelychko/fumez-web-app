import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MaterialInFormula, AccordInFormula } from "@/types/types";
import { Doc } from "@/convex/_generated/dataModel";

interface FormulaTableProps {
  materials: MaterialInFormula[];
  accords: AccordInFormula[];
  solventWeight: number;
  totalWeight: number;
  finalDilution: number;
  updateMaterialWeight: (index: number, weight: number) => void;
  updateMaterialDilution: (index: number, dilution: number) => void;
  updateAccordWeight: (index: number, weight: number) => void;
  confirmRemoveMaterial: (index: number) => void;
  confirmRemoveAccord: (index: number) => void;
  setSolventWeight: (weight: number) => void;
  preview?: boolean; // Make this optional
  handleScaleSubmit: () => void;
  handleDilutionScaleSubmit: () => void;
  setScaleValue: (value: string) => void;
  setDilutionScaleValue: (value: string) => void;
  initialData: Doc<"formulas">;
}

export const FormulaTable: React.FC<FormulaTableProps> = ({
  materials,
  accords,
  solventWeight,
  totalWeight,
  finalDilution,
  updateMaterialWeight,
  updateMaterialDilution,
  updateAccordWeight,
  confirmRemoveMaterial,
  confirmRemoveAccord,
  setSolventWeight,
  preview,
  handleScaleSubmit,
  handleDilutionScaleSubmit,
  setScaleValue,
  setDilutionScaleValue,
  initialData,
}) => {
  return (
    <div className="border shadow-sm rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Weight (g)</TableHead>
            <TableHead>Concentration</TableHead>
            <TableHead>Percentage</TableHead>
            {!preview && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material, index) => (
            <TableRow key={material.material}>
              <TableCell>{material.title}</TableCell>
              <TableCell>
                {preview ? (
                  material.weight
                ) : (
                  <Input
                    type="number"
                    value={material.weight}
                    onChange={(e) =>
                      updateMaterialWeight(index, Number(e.target.value))
                    }
                    aria-label={`Weight for ${material.title}`}
                  />
                )}
              </TableCell>
              <TableCell>
                {preview ? (
                  `${material.dilution}%`
                ) : (
                  <Select
                    value={`${material.dilution}`}
                    onValueChange={(value) =>
                      updateMaterialDilution(index, Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {material.dilutions?.map((dilution) => (
                        <SelectItem key={dilution} value={`${dilution}`}>
                          {dilution}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>
                {totalWeight > 0
                  ? ((material.weight / totalWeight) * 100).toFixed(2)
                  : 0}
                %
              </TableCell>
              {!preview && (
                <TableCell>
                  <Button onClick={() => confirmRemoveMaterial(index)}>
                    Remove
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}

          {accords.map((accord, index) => (
            <TableRow key={accord.accord}>
              <TableCell>{accord.title}</TableCell>
              <TableCell>
                {preview ? (
                  accord.weight
                ) : (
                  <Input
                    type="number"
                    value={accord.weight}
                    onChange={(e) =>
                      updateAccordWeight(index, Number(e.target.value))
                    }
                    aria-label={`Weight for ${accord.title}`}
                  />
                )}
              </TableCell>
              <TableCell>{accord.concentration}%</TableCell>
              <TableCell>
                {totalWeight > 0
                  ? ((accord.weight / totalWeight) * 100).toFixed(2)
                  : 0}
                %
              </TableCell>
              {!preview && (
                <TableCell>
                  <Button onClick={() => confirmRemoveAccord(index)}>
                    Remove
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}

          <TableRow>
            <TableCell>{initialData.solvent?.name || "Solvent"}</TableCell>
            <TableCell>
              {preview ? (
                solventWeight
              ) : (
                <Input
                  type="number"
                  value={solventWeight}
                  onChange={(e) => setSolventWeight(Number(e.target.value))}
                  aria-label="Solvent weight"
                />
              )}
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              {totalWeight > 0
                ? ((solventWeight / totalWeight) * 100).toFixed(2)
                : 0}
              %
            </TableCell>
            {!preview && <TableCell></TableCell>}
          </TableRow>

          <TableRow>
            <TableCell>Final</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={totalWeight === 0}
                  >
                    {totalWeight.toFixed(2)} g
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Scale Formula</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="number"
                    onChange={(e) => setScaleValue(e.target.value)}
                    placeholder="New total weight (g)"
                  />
                  <DialogFooter>
                    <Button onClick={handleScaleSubmit}>Scale</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={totalWeight === 0}
                  >
                    {finalDilution.toFixed(2)}%
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Scale to Concentration</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="number"
                    onChange={(e) => setDilutionScaleValue(e.target.value)}
                    placeholder="New concentration (%)"
                  />
                  <DialogFooter>
                    <Button onClick={handleDilutionScaleSubmit}>Scale</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell>100%</TableCell>
            {!preview && <TableCell></TableCell>}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
