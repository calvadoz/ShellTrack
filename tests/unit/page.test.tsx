import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("dexie-react-hooks", () => ({
  useLiveQuery: () => [],
}));

vi.mock("@/lib/db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/db")>()),
  ensureDefaultData: vi.fn().mockResolvedValue(undefined),
}));

import Home from "@/app/page";
import { getMessages } from "@/lib/i18n/messages";

const messages = getMessages();

describe("Home", () => {
  it("opens the local pet journal", async () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      messages.dashboard.heading,
    );
    expect(
      await screen.findByText(messages.dashboard.emptyHeading),
    ).toBeInTheDocument();
    expect(screen.getAllByText(messages.nav.localStatus)).toHaveLength(1);
  });
});
