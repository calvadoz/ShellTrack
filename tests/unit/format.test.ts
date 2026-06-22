import { describe, expect, it } from "vitest";

import {
  formatAgeYears,
  formatCalendarDate,
  formatCalendarYear,
  formatChartDate,
  formatDateTime,
  formatLength,
  formatMeasurementListDate,
  formatNumber,
  formatWeight,
} from "@/lib/i18n/format";

describe("localized formatting", () => {
  it("formats derived ages as a localized unit", () => {
    expect(formatAgeYears(4.78)).toBe("4.8 years");
  });

  it("formats a calendar date without shifting the day", () => {
    expect(formatCalendarDate("2026-06-20")).toContain("20");
  });

  it("formats compact chart dates", () => {
    expect(formatChartDate("2026-05-30")).toMatch(/May.+26/);
  });

  it("formats compact measurement list dates and year groups", () => {
    expect(formatMeasurementListDate("2026-05-30")).toMatch(/May.+30|30.+May/);
    expect(formatCalendarYear("2026-05-30")).toBe("2026");
  });

  it("rejects an impossible calendar date", () => {
    expect(() => formatCalendarDate("2026-02-30")).toThrow(RangeError);
  });

  it("formats exact moments in a chosen time zone", () => {
    const value = formatDateTime("2026-06-20T12:30:00.000Z", {
      timeZone: "UTC",
    });

    expect(value).toContain("2026");
  });

  it("formats numbers and converts display units", () => {
    expect(formatNumber(1234.5)).toMatch(/1.+234/);
    expect(formatWeight(1500, "kg")).toContain("1.5");
    expect(formatLength(125, "cm")).toContain("12.5");
  });
});
