// useFormulaCalculations.ts
import { useMemo } from 'react';
import { MaterialInFormula, AccordInFormula } from '@/types/types';

export const useFormulaCalculations = (
  materialsInFormula: MaterialInFormula[],
  accordsInFormula: AccordInFormula[],
  solventWeight: number
) => {
  const totalWeight = useMemo(() => {
    const materialWeight = materialsInFormula.reduce((sum, m) => sum + m.weight, 0);
    const accordWeight = accordsInFormula.reduce((sum, a) => sum + a.weight, 0);
    return materialWeight + accordWeight + solventWeight;
  }, [materialsInFormula, accordsInFormula, solventWeight]);

  const finalDilution = useMemo(() => {
    if (totalWeight === 0) return 0;
    const materialDilution = materialsInFormula.reduce(
      (sum, m) => sum + m.weight * (m.dilution / 100),
      0
    );
    const accordDilution = accordsInFormula.reduce(
      (sum, a) => sum + a.weight * (a.dilution / 100),
      0
    );
    return ((materialDilution + accordDilution) / totalWeight) * 100;
  }, [materialsInFormula, accordsInFormula, totalWeight]);

  const scaleFormula = (newTotalWeight: number) => {
    if (totalWeight === 0) return { materials: materialsInFormula, accords: accordsInFormula, solvent: solventWeight };
    const scaleFactor = newTotalWeight / totalWeight;
    return {
      materials: materialsInFormula.map(m => ({ ...m, weight: m.weight * scaleFactor })),
      accords: accordsInFormula.map(a => ({ ...a, weight: a.weight * scaleFactor })),
      solvent: solventWeight * scaleFactor
    };
  };

  const scaleFormulaByDilution = (newDilution: number) => {
    if (finalDilution === 0) return { materials: materialsInFormula, accords: accordsInFormula, solvent: solventWeight };
    
    const totalMaterialDilutionWeight = materialsInFormula.reduce(
      (sum, m) => sum + m.weight * (m.dilution / 100),
      0
    );
    const totalAccordDilutionWeight = accordsInFormula.reduce(
      (sum, a) => sum + a.weight * (a.dilution / 100),
      0
    );
    const totalDilutionWeight = totalMaterialDilutionWeight + totalAccordDilutionWeight;
    
    const requiredTotalWeight = totalDilutionWeight / (newDilution / 100);
    const requiredSolventWeight = requiredTotalWeight - (totalWeight - solventWeight);
    
    if (requiredSolventWeight < 0) {
      throw new Error("Cannot scale to desired concentration. Adjust material concentrations.");
    }
    
    return {
      materials: materialsInFormula,
      accords: accordsInFormula,
      solvent: requiredSolventWeight
    };
  };

  return { totalWeight, finalDilution, scaleFormula, scaleFormulaByDilution };
};
