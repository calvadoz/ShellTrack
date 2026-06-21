import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WeightChart } from "@/components/app/shelltrack-app";
import type { Measurement } from "@/lib/domain";
import { getMessages } from "@/lib/i18n/messages";

const messages = getMessages();
const measurements: Measurement[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    petId: "00000000-0000-4000-8000-000000000010",
    measuredAt: "2026-01-01",
    weightGram: 1000,
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-01-01T12:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    petId: "00000000-0000-4000-8000-000000000010",
    measuredAt: "2026-02-01",
    weightGram: 850,
    createdAt: "2026-02-01T12:00:00.000Z",
    updatedAt: "2026-02-01T12:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    petId: "00000000-0000-4000-8000-000000000010",
    measuredAt: "2026-03-01",
    weightGram: 920,
    createdAt: "2026-03-01T12:00:00.000Z",
    updatedAt: "2026-03-01T12:00:00.000Z",
  },
];

describe("WeightChart", () => {
  it("renders axes, a legend, and one accessible point per record", () => {
    render(<WeightChart measurements={measurements} />);

    expect(screen.getByRole("img", { name: messages.pet.chart })).toBeVisible();
    expect(screen.getByText(messages.pet.chartLegendRecorded)).toBeVisible();
    expect(screen.getByText(messages.pet.chartLegendDrop)).toBeVisible();
    expect(screen.getByText(messages.pet.chartDateAxis)).toBeVisible();
    expect(
      screen.getByText(messages.pet.chartWeightAxisKilogram),
    ).toBeVisible();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
});
