import { MCC_CATEGORY_MAP, CATEGORY_KEYWORDS, DEFAULT_CATEGORY } from './constants';

/**
 * Classify a transaction into a carbon category based on MCC code and description
 */
export function classifyTransaction(
  mcc: string | null | undefined,
  description: string
): string {
  // First, try MCC code lookup
  if (mcc && MCC_CATEGORY_MAP[mcc]) {
    return MCC_CATEGORY_MAP[mcc];
  }

  // Fallback to keyword matching in description
  const lowerDescription = description.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerDescription.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  return DEFAULT_CATEGORY;
}

/**
 * Extract potential quantity from transaction description
 * (e.g., "15.5 gal" or "250 kWh")
 */
export function extractQuantity(description: string): {
  value: number;
  unit: string;
} | null {
  // Match patterns like "15.5 gal", "12.3 gallons", "250 kWh"
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(gal|gallon|gallons)/i,
    /(\d+(?:\.\d+)?)\s*(kwh|kilowatt)/i,
    /(\d+(?:\.\d+)?)\s*(mi|mile|miles)/i,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      let unit = match[2].toLowerCase();

      // Normalize units
      if (unit.startsWith('gal')) unit = 'gallon';
      if (unit.includes('kwh') || unit.includes('kilowatt')) unit = 'kWh';
      if (unit.startsWith('mi')) unit = 'mile';

      return { value, unit };
    }
  }

  return null;
}

