// Unit conversion utilities
// Always store weights in kg internally, convert for display

export type WeightUnit = 'kg' | 'lb';

export const toDisplayWeight = (weightKg: number, units: WeightUnit): number => {
  if (units === 'lb') {
    return Math.round(weightKg * 2.20462 * 10) / 10; // Round to 1 decimal
  }
  return Math.round(weightKg * 10) / 10; // Round to 1 decimal
};

export const fromDisplayWeight = (displayWeight: number, units: WeightUnit): number => {
  if (units === 'lb') {
    return displayWeight / 2.20462;
  }
  return displayWeight;
};

export const getWeightUnit = (units: WeightUnit): string => {
  return units === 'kg' ? 'kg' : 'lbs';
};