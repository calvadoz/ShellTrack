import { defaultLocale, type SupportedLocale } from "@/lib/i18n/config";

type FormatOptions = {
  locale?: SupportedLocale;
};

type DateTimeOptions = FormatOptions & {
  timeZone?: string;
};

function toDate(value: Date | number | string): Date {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new RangeError("The date is not valid.");
  }

  return date;
}

export function formatCalendarDate(
  isoDate: string,
  { locale = defaultLocale }: FormatOptions = {},
): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);

  if (!match) {
    throw new RangeError("Use a calendar date in YYYY-MM-DD format.");
  }

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new RangeError("The calendar date is not valid.");
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export function formatChartDate(
  isoDate: string,
  { locale = defaultLocale }: FormatOptions = {},
): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) throw new RangeError("Use a calendar date in YYYY-MM-DD format.");
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateTime(
  value: Date | number | string,
  { locale = defaultLocale, timeZone }: DateTimeOptions = {},
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(toDate(value));
}

export function formatNumber(
  value: number,
  options: FormatOptions & Intl.NumberFormatOptions = {},
): string {
  const { locale = defaultLocale, ...numberOptions } = options;
  return new Intl.NumberFormat(locale, numberOptions).format(value);
}

export function formatWeight(
  weightGram: number,
  unit: "g" | "kg",
  { locale = defaultLocale }: FormatOptions = {},
): string {
  const value = unit === "kg" ? weightGram / 1_000 : weightGram;
  const unitName = unit === "kg" ? "kilogram" : "gram";

  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: unitName,
    unitDisplay: "short",
    maximumFractionDigits: unit === "kg" ? 3 : 0,
  }).format(value);
}

export function formatLength(
  lengthMm: number,
  unit: "mm" | "cm",
  { locale = defaultLocale }: FormatOptions = {},
): string {
  const value = unit === "cm" ? lengthMm / 10 : lengthMm;
  const unitName = unit === "cm" ? "centimeter" : "millimeter";

  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: unitName,
    unitDisplay: "short",
    maximumFractionDigits: unit === "cm" ? 1 : 0,
  }).format(value);
}

export function formatAgeYears(
  years: number,
  { locale = defaultLocale }: FormatOptions = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "year",
    unitDisplay: "long",
    maximumFractionDigits: 1,
  }).format(years);
}
