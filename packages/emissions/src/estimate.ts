import { EmissionMethod } from '@carbon-ledger/types';
import { SPEND_INTENSITY_FACTORS, ACTIVITY_FACTORS } from './datasets';
import { extractQuantity } from './classify';

export interface EmissionEstimateResult {
  kgCO2e: number;
  method: EmissionMethod;
  factorId?: string;
  details: {
    source: string;
    factor: number;
    unit: string;
    input: number;
    categoryKey: string;
    notes: string;
    confidence: 'high' | 'medium' | 'low';
  };
}

/**
 * Estimate emissions for a transaction
 */
export function estimateEmissions(
  amountUSD: number,
  category: string,
  description: string
): EmissionEstimateResult {
  // Try activity-based estimation first (more accurate when quantity is known)
  const quantity = extractQuantity(description);
  if (quantity) {
    const activityResult = tryActivityBasedEstimate(category, quantity.value, quantity.unit);
    if (activityResult) {
      return activityResult;
    }
  }

  // Fallback to spend-based intensity
  return spendBasedEstimate(amountUSD, category);
}

function tryActivityBasedEstimate(
  category: string,
  value: number,
  unit: string
): EmissionEstimateResult | null {
  // Find matching activity factor
  const factor = ACTIVITY_FACTORS.find(
    (f) => f.categoryKey.startsWith(category) && f.unit === unit
  );

  if (!factor) {
    return null;
  }

  const kgCO2e = value * factor.kgCO2ePerUnit;

  return {
    kgCO2e,
    method: EmissionMethod.ACTIVITY,
    details: {
      source: factor.source,
      factor: factor.kgCO2ePerUnit,
      unit: factor.unit,
      input: value,
      categoryKey: factor.categoryKey,
      notes: factor.notes,
      confidence: 'high',
    },
  };
}

function spendBasedEstimate(amountUSD: number, category: string): EmissionEstimateResult {
  // Find matching spend intensity factor
  let factor = SPEND_INTENSITY_FACTORS.find((f) => f.categoryKey === category);

  // Fallback to 'other' if no exact match
  if (!factor) {
    factor = SPEND_INTENSITY_FACTORS.find((f) => f.categoryKey === 'other')!;
  }

  const kgCO2e = amountUSD * factor.kgCO2ePerUnit;

  return {
    kgCO2e,
    method: EmissionMethod.INTENSITY,
    details: {
      source: factor.source,
      factor: factor.kgCO2ePerUnit,
      unit: 'USD',
      input: amountUSD,
      categoryKey: factor.categoryKey,
      notes: factor.notes,
      confidence: category === 'other' ? 'low' : 'medium',
    },
  };
}

/**
 * Batch estimate emissions for multiple transactions
 */
export function batchEstimateEmissions(
  transactions: Array<{
    amountUSD: number;
    category: string;
    description: string;
  }>
): EmissionEstimateResult[] {
  return transactions.map((txn) =>
    estimateEmissions(txn.amountUSD, txn.category, txn.description)
  );
}

