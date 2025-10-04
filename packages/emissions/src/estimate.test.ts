import { describe, it, expect } from 'vitest';
import { estimateEmissions } from './estimate';

describe('estimateEmissions', () => {
  it('should use activity-based estimation when quantity is present', () => {
    const result = estimateEmissions(
      45.32,
      'transport.fuel',
      'Shell Gas Station - 12.5 gal'
    );

    expect(result.method).toBe('ACTIVITY');
    expect(result.kgCO2e).toBeCloseTo(111.125, 1); // 12.5 * 8.89
    expect(result.details.confidence).toBe('high');
    expect(result.details.unit).toBe('gallon');
  });

  it('should use spend-based estimation when no quantity is present', () => {
    const result = estimateEmissions(
      45.32,
      'transport.fuel',
      'Shell Gas Station'
    );

    expect(result.method).toBe('INTENSITY');
    expect(result.kgCO2e).toBeCloseTo(23.57, 1); // 45.32 * 0.52
    expect(result.details.confidence).toBe('medium');
    expect(result.details.unit).toBe('USD');
  });

  it('should fallback to "other" category for unknown categories', () => {
    const result = estimateEmissions(
      100,
      'unknown.category',
      'Some random merchant'
    );

    expect(result.method).toBe('INTENSITY');
    expect(result.details.categoryKey).toBe('other');
    expect(result.details.confidence).toBe('low');
  });

  it('should handle electricity with kWh data', () => {
    const result = estimateEmissions(
      156.89,
      'utilities.electricity',
      'PG&E Electric Bill - 450 kWh'
    );

    expect(result.method).toBe('ACTIVITY');
    expect(result.kgCO2e).toBeCloseTo(173.25, 1); // 450 * 0.385
    expect(result.details.unit).toBe('kWh');
  });

  it('should handle grocery purchases', () => {
    const result = estimateEmissions(
      127.45,
      'grocery',
      'Whole Foods Market'
    );

    expect(result.method).toBe('INTENSITY');
    expect(result.kgCO2e).toBeCloseTo(44.61, 1); // 127.45 * 0.35
    expect(result.details.categoryKey).toBe('grocery');
  });
});

