import {
  addons,
  formulas,
  pricingGrid,
  vehicleSizes,
  type FormulaId,
  type SizeId,
} from "@/content/site-data";

export function getActiveAddons() {
  return addons.filter((addon) => addon.active);
}

export function getFormula(id: FormulaId | null) {
  if (!id) return null;
  return formulas.find((formula) => formula.id === id) ?? null;
}

export function getVehicleSize(id: SizeId | null) {
  if (!id) return null;
  return vehicleSizes.find((size) => size.id === id) ?? null;
}

export function getBasePrice(formulaId: FormulaId | null, sizeId: SizeId | null): number {
  if (!formulaId || !sizeId) return 0;
  return pricingGrid[formulaId][sizeId];
}

export function getAddonsTotal(addonIds: string[]): number {
  return addonIds.reduce((sum, id) => {
    const addon = addons.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);
}

export function calculateTotal(
  formulaId: FormulaId | null,
  sizeId: SizeId | null,
  addonIds: string[]
): number {
  return getBasePrice(formulaId, sizeId) + getAddonsTotal(addonIds);
}

export interface PriceBreakdown {
  lines: string[];
  total: number;
  isComplete: boolean;
}

export function getPriceBreakdown(
  formulaId: FormulaId | null,
  sizeId: SizeId | null,
  addonIds: string[]
): PriceBreakdown {
  const formula = getFormula(formulaId);
  const size = getVehicleSize(sizeId);
  const isComplete = Boolean(formula && size);

  const lines: string[] = [];

  if (formula && size) {
    const basePrice = getBasePrice(formulaId, sizeId);
    lines.push(`${formula.name} ${size.label} ${basePrice} €`);
  }

  for (const addonId of addonIds) {
    const addon = addons.find((a) => a.id === addonId);
    if (addon) {
      lines.push(`${addon.label} ${addon.price} €`);
    }
  }

  return {
    lines,
    total: calculateTotal(formulaId, sizeId, addonIds),
    isComplete,
  };
}

export function formatPriceBreakdownText(breakdown: PriceBreakdown): string {
  if (breakdown.lines.length === 0) return "";
  return `${breakdown.lines.join(" + ")} = ${breakdown.total} €`;
}
