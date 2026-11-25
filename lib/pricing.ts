import { addons, formatAddonPrice, formulas, type FormulaId } from "@/content/site-data";

export function getActiveAddons() {
  return addons.filter((addon) => addon.active);
}

export function getFormula(id: FormulaId | null) {
  if (!id) return null;
  return formulas.find((formula) => formula.id === id) ?? null;
}

export function getBasePrice(formulaId: FormulaId | null): number {
  return getFormula(formulaId)?.priceFrom ?? 0;
}

/** Total des suppléments : minimum et maximum (identiques sans fourchette). */
export function getAddonsTotal(addonIds: string[]): { min: number; max: number } {
  return addonIds.reduce(
    (sum, id) => {
      const addon = addons.find((a) => a.id === id);
      if (!addon) return sum;
      return { min: sum.min + addon.price, max: sum.max + (addon.priceMax ?? addon.price) };
    },
    { min: 0, max: 0 },
  );
}

export interface PriceBreakdown {
  lines: string[];
  /** Total minimum (prix fixe si aucun supplément variable). */
  total: number;
  /** Total maximum : différent de `total` si un supplément est variable. */
  totalMax: number;
  isComplete: boolean;
}

export function getPriceBreakdown(formulaId: FormulaId | null, addonIds: string[]): PriceBreakdown {
  const formula = getFormula(formulaId);
  const isComplete = Boolean(formula);

  const lines: string[] = [];

  if (formula) {
    lines.push(`${formula.name} ${formula.priceFrom} €`);
  }

  for (const addonId of addonIds) {
    const addon = addons.find((a) => a.id === addonId);
    if (addon) {
      lines.push(
        addon.priceMax
          ? `${addon.label} ${formatAddonPrice(addon)} (ajusté sur place selon l'état)`
          : `${addon.label} ${formatAddonPrice(addon)}`,
      );
    }
  }

  const base = getBasePrice(formulaId);
  const extra = getAddonsTotal(addonIds);
  return {
    lines,
    total: base + extra.min,
    totalMax: base + extra.max,
    isComplete,
  };
}

/** Total lisible : « 89 € » ou « 99 à 109 € ». */
export function formatTotal(breakdown: Pick<PriceBreakdown, "total" | "totalMax">): string {
  return breakdown.totalMax > breakdown.total
    ? `${breakdown.total} à ${breakdown.totalMax} €`
    : `${breakdown.total} €`;
}

export function formatPriceBreakdownText(breakdown: PriceBreakdown): string {
  if (breakdown.lines.length === 0) return "";
  return `${breakdown.lines.join(" + ")} = ${formatTotal(breakdown)}`;
}
