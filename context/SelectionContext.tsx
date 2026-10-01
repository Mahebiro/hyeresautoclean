"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { addons, type FormulaId } from "@/content/site-data";

export interface Selection {
  vehicleModel: string;
  formula: FormulaId | null;
  addonIds: string[];
}

interface SelectionContextValue {
  selection: Selection;
  setVehicleModel: (value: string) => void;
  setFormula: (formula: FormulaId) => void;
  toggleAddon: (id: string) => void;
  /** Étape affichée dans la réservation (0 = formule … 3 = coordonnées). */
  bookingStep: number;
  setBookingStep: (step: number) => void;
  /** Depuis la section Formules : formule choisie, réservation à l'étape 2. */
  pickFormula: (formula: FormulaId) => void;
}

const defaultSelection: Selection = {
  vehicleModel: "",
  formula: null,
  addonIds: [],
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(defaultSelection);
  const [bookingStep, setBookingStep] = useState(0);

  const value = useMemo<SelectionContextValue>(
    () => ({
      selection,
      setVehicleModel: (vehicleModel) => setSelection((s) => ({ ...s, vehicleModel })),
      setFormula: (formula) => setSelection((s) => ({ ...s, formula })),
      toggleAddon: (id) =>
        setSelection((s) => {
          if (s.addonIds.includes(id)) {
            return { ...s, addonIds: s.addonIds.filter((a) => a !== id) };
          }
          // Les options d'un même groupe exclusif ne se cumulent pas.
          const group = addons.find((a) => a.id === id)?.exclusiveGroup;
          const kept = group
            ? s.addonIds.filter((a) => addons.find((x) => x.id === a)?.exclusiveGroup !== group)
            : s.addonIds;
          return { ...s, addonIds: [...kept, id] };
        }),
      bookingStep,
      setBookingStep,
      pickFormula: (formula) => {
        setSelection((s) => ({ ...s, formula }));
        setBookingStep(1);
      },
    }),
    [selection, bookingStep]
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
