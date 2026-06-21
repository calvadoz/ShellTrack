import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";
import { getMessages } from "@/lib/i18n/messages";

const messages = getMessages();

describe("Home", () => {
  it("communicates the local-first foundation", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      messages.home.heading,
    );
    expect(
      screen.getByText(messages.home.principles[0].title),
    ).toBeInTheDocument();
    expect(
      screen.getByText(messages.home.principles[1].description),
    ).toBeInTheDocument();
  });
});
