export type Measurement = {
  id: string;
  petId: string;
  measuredAt: string;
  weightGram: number;
  shellLengthMm?: number;
  shellWidthMm?: number;
  shellHeightMm?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type MeasurementDraft = Omit<
  Measurement,
  "id" | "createdAt" | "updatedAt"
>;
