import { addons, formulas, type FormulaId } from "@/content/site-data";

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

export function getAddonsTotal(addonIds: string[]): number {
  return addonIds.reduce((sum, id) => {
    const addon = addons.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);
}

export function calculateTotal(formulaId: FormulaId | null, addonIds: string[]): number {
  return getBasePrice(formulaId) + getAddonsTotal(addonIds);
}

export interface PriceBreakdown {
  lines: string[];
  total: number;
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
      lines.push(`${addon.label} ${addon.price} €`);
    }
  }

  return {
    lines,
    total: calculateTotal(formulaId, addonIds),
    isComplete,
  };
}

export function formatPriceBreakdownText(breakdown: PriceBreakdown): string {
  if (breakdown.lines.length === 0) return "";
  return `${breakdown.lines.join(" + ")} = ${breakdown.total} €`;
}
