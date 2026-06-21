export type WeightUnit = "g" | "kg";
export type LengthUnit = "mm" | "cm";

export function weightToGram(value: number, unit: WeightUnit): number {
  return unit === "kg" ? value * 1000 : value;
}

export function gramToWeight(value: number, unit: WeightUnit): number {
  return unit === "kg" ? value / 1000 : value;
}

export function lengthToMm(value: number, unit: LengthUnit): number {
  return unit === "cm" ? value * 10 : value;
}

export function mmToLength(value: number, unit: LengthUnit): number {
  return unit === "cm" ? value / 10 : value;
}
