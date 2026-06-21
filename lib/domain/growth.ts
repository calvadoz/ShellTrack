export const significantWeightDropPercent = 10;

export function weightChangePercent(
  previousWeightGram: number,
  currentWeightGram: number,
): number {
  if (previousWeightGram <= 0) return 0;
  return ((currentWeightGram - previousWeightGram) / previousWeightGram) * 100;
}

export function isSignificantWeightDrop(
  previousWeightGram: number,
  currentWeightGram: number,
): boolean {
  return (
    weightChangePercent(previousWeightGram, currentWeightGram) <=
    -significantWeightDropPercent
  );
}
