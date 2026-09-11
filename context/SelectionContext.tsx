"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { FormulaId, SizeId } from "@/content/site-data";

export interface Selection {
  vehicleModel: string;
  size: SizeId | null;
  formula: FormulaId | null;
  addonIds: string[];
}

interface SelectionContextValue {
  selection: Selection;
  setVehicleModel: (value: string) => void;
  setSize: (size: SizeId) => void;
  setFormula: (formula: FormulaId) => void;
  toggleAddon: (id: string) => void;
}

const defaultSelection: Selection = {
  vehicleModel: "",
  size: null,
  formula: null,
  addonIds: [],
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(defaultSelection);

  const value = useMemo<SelectionContextValue>(
    () => ({
      selection,
      setVehicleModel: (vehicleModel) => setSelection((s) => ({ ...s, vehicleModel })),
      setSize: (size) => setSelection((s) => ({ ...s, size })),
      setFormula: (formula) => setSelection((s) => ({ ...s, formula })),
      toggleAddon: (id) =>
        setSelection((s) => ({
          ...s,
          addonIds: s.addonIds.includes(id)
            ? s.addonIds.filter((a) => a !== id)
            : [...s.addonIds, id],
        })),
    }),
    [selection]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error("useSelection doit être utilisé à l'intérieur de <SelectionProvider>");
  }
  return ctx;
}
