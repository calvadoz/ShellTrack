import type { Measurement } from "@/lib/domain";

function cell(value: string | number | undefined): string {
  if (value === undefined) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function measurementsToCsv(measurements: Measurement[]): string {
  const rows = [
    [
      "measurement_id",
      "pet_id",
      "date",
      "weight_g",
      "shell_length_mm",
      "shell_width_mm",
      "shell_height_mm",
      "notes",
    ],
    ...measurements.map((measurement) => [
      measurement.id,
      measurement.petId,
      measurement.measuredAt,
      measurement.weightGram,
      measurement.shellLengthMm,
      measurement.shellWidthMm,
      measurement.shellHeightMm,
      measurement.notes,
    ]),
  ];
  return rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
