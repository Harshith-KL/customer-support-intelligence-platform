import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  analyzeTicket,
  getAnalysisHistory,
} from "../services/aiAnalysisService";
import AIAnalysisPanel from "./AIAnalysisPanel";

vi.mock("../services/aiAnalysisService", () => ({
  analyzeTicket: vi.fn(),
  getAnalysisHistory: vi.fn(),
}));

afterEach(cleanup);

beforeEach(() => {
  vi.mocked(analyzeTicket).mockResolvedValue({
    id: 27,
    category_recommendation: "Billing",
    priority_recommendation: "High",
    summary: "Customer reports a duplicate charge.",
    reason: "The ticket states that the customer was charged twice.",
    provider: "OpenRouter",
    model_name: "openrouter/free",
  });
  vi.mocked(getAnalysisHistory).mockResolvedValue({
    items: [],
    total: 0,
  });
});

describe("AIAnalysisPanel recommendation review", () => {
  it("allows edits while retaining and displaying the original analysis", async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();

    render(
      <AIAnalysisPanel
        ticket={{ id: "TICKET-27" }}
        onAccept={onAccept}
        accepting={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Analyse Ticket" }));

    expect(
      await screen.findByText("Customer reports a duplicate charge."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The ticket states that the customer was charged twice."),
    ).toBeInTheDocument();
    expect(screen.getByText("AI category: Billing")).toBeInTheDocument();
    expect(screen.getByText("AI priority: High")).toBeInTheDocument();

    await user.click(
      screen.getByRole("combobox", { name: "Final category" }),
    );
    await user.click(await screen.findByRole("option", { name: "Account" }));
    await user.click(
      screen.getByRole("combobox", { name: "Final priority" }),
    );
    await user.click(await screen.findByRole("option", { name: "Low" }));
    await user.click(
      screen.getByRole("button", { name: "Accept Recommendations" }),
    );

    await waitFor(() => {
      expect(onAccept).toHaveBeenCalledWith(27, {
        category: "Account",
        priority: "Low",
      });
    });
    expect(screen.getByText("AI category: Billing")).toBeInTheDocument();
    expect(screen.getByText("AI priority: High")).toBeInTheDocument();
  });
});
