import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import TicketForm from "./TicketForm";

afterEach(cleanup);

describe("TicketForm", () => {
  it("shows validation errors and does not submit an empty form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TicketForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Create Ticket" }));

    expect(
      await screen.findByText("Minimum 5 characters required"),
    ).toBeInTheDocument();
    expect(screen.getByText("Customer ID is required")).toBeInTheDocument();
    expect(
      screen.getByText("Minimum 10 characters required"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid ticket fields with the selected defaults", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TicketForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByRole("textbox", { name: "Ticket Title" }),
      "Payment could not be completed",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Customer ID" }),
      "CUST-001",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Description" }),
      "The payment was declined during renewal.",
    );
    await user.click(screen.getByRole("button", { name: "Create Ticket" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      title: "Payment could not be completed",
      customerName: "CUST-001",
      description: "The payment was declined during renewal.",
      category: "Other",
      priority: "Medium",
      status: "Open",
      sentiment: "Neutral",
    });
  });
});
