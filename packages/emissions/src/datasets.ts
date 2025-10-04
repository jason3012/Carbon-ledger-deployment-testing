// Local emission factors (fallback data)

export interface LocalEmissionFactor {
  categoryKey: string;
  source: string;
  scope: string;
  unitType: string;
  unit: string;
  kgCO2ePerUnit: number;
  notes: string;
}

// Spend-based intensity factors (kg CO2e per USD)
export const SPEND_INTENSITY_FACTORS: LocalEmissionFactor[] = [
  {
    categoryKey: 'transport.fuel',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.52,
    notes: 'Gasoline stations - average intensity per dollar spent',
  },
  {
    categoryKey: 'transport.publictransit',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.18,
    notes: 'Public transit - average intensity per dollar spent',
  },
  {
    categoryKey: 'transport.airline',
    source: 'DEFRA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.45,
    notes: 'Air travel - average intensity per dollar spent',
  },
  {
    categoryKey: 'utilities.electricity',
    source: 'EPA eGRID',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.62,
    notes: 'Electricity - US average grid intensity per dollar',
  },
  {
    categoryKey: 'utilities.telecom',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.08,
    notes: 'Telecommunications - average intensity per dollar',
  },
  {
    categoryKey: 'grocery',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.35,
    notes: 'Grocery - average food intensity per dollar',
  },
  {
    categoryKey: 'restaurants',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.42,
    notes: 'Food services and restaurants - average intensity',
  },
  {
    categoryKey: 'apparel',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.28,
    notes: 'Clothing and apparel - average manufacturing intensity',
  },
  {
    categoryKey: 'electronics',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.31,
    notes: 'Consumer electronics - average intensity',
  },
  {
    categoryKey: 'home',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.38,
    notes: 'Home goods and furniture - average intensity',
  },
  {
    categoryKey: 'entertainment',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.15,
    notes: 'Entertainment services - average intensity',
  },
  {
    categoryKey: 'healthcare',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.22,
    notes: 'Healthcare services - average intensity',
  },
  {
    categoryKey: 'other',
    source: 'EPA/EIOMLCA',
    scope: 'spend',
    unitType: 'monetary',
    unit: 'USD',
    kgCO2ePerUnit: 0.25,
    notes: 'Other services - default average intensity',
  },
];

// Activity-based factors (when quantity is known)
export const ACTIVITY_FACTORS: LocalEmissionFactor[] = [
  {
    categoryKey: 'transport.fuel.gasoline',
    source: 'EPA',
    scope: 'combustion',
    unitType: 'volume',
    unit: 'gallon',
    kgCO2ePerUnit: 8.89,
    notes: 'Gasoline combustion - 8.89 kg CO2e per gallon',
  },
  {
    categoryKey: 'transport.fuel.diesel',
    source: 'EPA',
    scope: 'combustion',
    unitType: 'volume',
    unit: 'gallon',
    kgCO2ePerUnit: 10.21,
    notes: 'Diesel combustion - 10.21 kg CO2e per gallon',
  },
  {
    categoryKey: 'utilities.electricity.grid',
    source: 'EPA eGRID',
    scope: 'consumption',
    unitType: 'energy',
    unit: 'kWh',
    kgCO2ePerUnit: 0.385,
    notes: 'US average grid electricity - 0.385 kg CO2e per kWh',
  },
  {
    categoryKey: 'transport.airline.short',
    source: 'DEFRA',
    scope: 'travel',
    unitType: 'distance',
    unit: 'mile',
    kgCO2ePerUnit: 0.254,
    notes: 'Short-haul flight (<500 mi) - economy class',
  },
  {
    categoryKey: 'transport.airline.long',
    source: 'DEFRA',
    scope: 'travel',
    unitType: 'distance',
    unit: 'mile',
    kgCO2ePerUnit: 0.195,
    notes: 'Long-haul flight (>3000 mi) - economy class',
  },
];

export function getAllLocalFactors(): LocalEmissionFactor[] {
  return [...SPEND_INTENSITY_FACTORS, ...ACTIVITY_FACTORS];
}

