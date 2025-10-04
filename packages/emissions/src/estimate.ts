import { EmissionMethod } from '@carbon-ledger/types';
import { SPEND_INTENSITY_FACTORS, ACTIVITY_FACTORS } from './datasets';
import { extractQuantity } from './classify';

// Enhanced emission factors with seasonal and regional adjustments
interface EnhancedEmissionFactor {
  baseFactor: number;
  seasonalAdjustments: {
    winter: number; // December, January, February
    spring: number; // March, April, May
    summer: number; // June, July, August
    fall: number;   // September, October, November
  };
  regionalAdjustments: {
    northeast: number;
    southeast: number;
    midwest: number;
    southwest: number;
    west: number;
    pacific: number;
  };
  confidence: number; // 0-1 confidence score
  lastUpdated: Date;
}

// Machine learning classification weights
interface MLClassificationWeights {
  mccWeight: number;
  descriptionWeight: number;
  merchantWeight: number;
  amountWeight: number;
  historicalWeight: number;
}

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
    seasonalAdjustment?: number;
    regionalAdjustment?: number;
    mlConfidence?: number;
  };
}

// Enhanced estimation with seasonal and regional adjustments
export interface EnhancedEstimationOptions {
  date?: Date;
  region?: 'northeast' | 'southeast' | 'midwest' | 'southwest' | 'west' | 'pacific';
  useML?: boolean;
  historicalData?: Array<{
    amountUSD: number;
    category: string;
    description: string;
    actualEmissions?: number;
  }>;
}

/**
 * Enhanced estimate emissions for a transaction with ML and adjustments
 */
export function estimateEmissions(
  amountUSD: number,
  category: string,
  description: string,
  options?: EnhancedEstimationOptions
): EmissionEstimateResult {
  // Use enhanced estimation if options provided
  if (options) {
    return enhancedEstimateEmissions(amountUSD, category, description, options);
  }

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

/**
 * Enhanced estimation with seasonal, regional, and ML adjustments
 */
function enhancedEstimateEmissions(
  amountUSD: number,
  category: string,
  description: string,
  options: EnhancedEstimationOptions
): EmissionEstimateResult {
  // Get base estimation
  const baseResult = estimateEmissions(amountUSD, category, description);
  
  let adjustedKgCO2e = baseResult.kgCO2e;
  let seasonalAdjustment = 1;
  let regionalAdjustment = 1;
  let mlConfidence = 0.8;

  // Apply seasonal adjustments
  if (options.date) {
    seasonalAdjustment = getSeasonalAdjustment(category, options.date);
    adjustedKgCO2e *= seasonalAdjustment;
  }

  // Apply regional adjustments
  if (options.region) {
    regionalAdjustment = getRegionalAdjustment(category, options.region);
    adjustedKgCO2e *= regionalAdjustment;
  }

  // Apply ML improvements if enabled
  if (options.useML && options.historicalData) {
    const mlResult = applyMLImprovements(amountUSD, category, description, options.historicalData);
    adjustedKgCO2e = mlResult.adjustedEmissions;
    mlConfidence = mlResult.confidence;
  }

  return {
    ...baseResult,
    kgCO2e: adjustedKgCO2e,
    details: {
      ...baseResult.details,
      seasonalAdjustment,
      regionalAdjustment,
      mlConfidence,
      confidence: mlConfidence > 0.9 ? 'high' : mlConfidence > 0.7 ? 'medium' : 'low'
    }
  };
}

/**
 * Get seasonal adjustment factor for a category
 */
function getSeasonalAdjustment(category: string, date: Date): number {
  const month = date.getMonth() + 1; // 1-12
  let season: keyof EnhancedEmissionFactor['seasonalAdjustments'];
  
  if (month >= 12 || month <= 2) season = 'winter';
  else if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else season = 'fall';

  // Seasonal adjustments based on category
  const seasonalFactors: Record<string, Record<string, number>> = {
    'transport.fuel': { winter: 1.1, spring: 1.0, summer: 1.05, fall: 1.0 },
    'utilities.electricity': { winter: 1.2, spring: 0.9, summer: 1.3, fall: 0.9 },
    'utilities.gas': { winter: 1.4, spring: 0.8, summer: 0.6, fall: 0.8 },
    'restaurants': { winter: 1.0, spring: 1.0, summer: 1.1, fall: 1.0 },
    'entertainment': { winter: 0.9, spring: 1.0, summer: 1.2, fall: 1.0 },
  };

  return seasonalFactors[category]?.[season] || 1.0;
}

/**
 * Get regional adjustment factor for a category
 */
function getRegionalAdjustment(category: string, region: string): number {
  // Regional adjustments based on energy mix and consumption patterns
  const regionalFactors: Record<string, Record<string, number>> = {
    'utilities.electricity': {
      northeast: 0.8,  // More nuclear and hydro
      southeast: 1.1,  // More coal
      midwest: 1.2,    // More coal
      southwest: 1.0,  // Mixed
      west: 0.7,       // More renewables
      pacific: 0.6     // More renewables
    },
    'transport.fuel': {
      northeast: 0.9,  // More public transit
      southeast: 1.1,  // More driving
      midwest: 1.0,    // Average
      southwest: 1.2,  // More driving
      west: 1.0,       // Average
      pacific: 0.8     // More public transit
    }
  };

  return regionalFactors[category]?.[region] || 1.0;
}

/**
 * Apply machine learning improvements based on historical data
 */
function applyMLImprovements(
  amountUSD: number,
  category: string,
  description: string,
  historicalData: Array<{
    amountUSD: number;
    category: string;
    description: string;
    actualEmissions?: number;
  }>
): { adjustedEmissions: number; confidence: number } {
  // Find similar historical transactions
  const similarTransactions = historicalData.filter(txn => 
    txn.category === category && 
    Math.abs(txn.amountUSD - amountUSD) / amountUSD < 0.5 // Within 50% amount
  );

  if (similarTransactions.length < 3) {
    return { adjustedEmissions: amountUSD * 0.5, confidence: 0.5 }; // Default fallback
  }

  // Calculate average emissions per dollar for similar transactions
  const avgEmissionsPerDollar = similarTransactions
    .filter(txn => txn.actualEmissions)
    .reduce((sum, txn) => sum + (txn.actualEmissions! / txn.amountUSD), 0) / 
    similarTransactions.filter(txn => txn.actualEmissions).length;

  const adjustedEmissions = amountUSD * avgEmissionsPerDollar;
  const confidence = Math.min(0.95, 0.5 + (similarTransactions.length * 0.1));

  return { adjustedEmissions, confidence };
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

