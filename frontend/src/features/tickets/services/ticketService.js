
import { initialTickets } from "../../../utils/mockTickets";

const STORAGE_KEY = "customer_support_tickets";

function readTickets() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === null) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialTickets)
      );

      return initialTickets;
    }

    return JSON.parse(stored);
  } catch {
    return initialTickets;
  }
}

function saveTickets(tickets) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tickets)
  );
}

export async function getTickets() {
  return readTickets();
}

export async function getTicketById(id) {
  const tickets = readTickets();

  return tickets.find((ticket) => ticket.id === id) || null;
}

export async function createTicket(data) {
  const tickets = readTickets();

  const newTicket = {
    ...data,
    id: `TKT-${Date.now()}`,
    status: "Open",
    createdAt: new Date().toISOString(),
    aiSummary: "",
    aiReason: "",
  };

  saveTickets([newTicket, ...tickets]);

  return newTicket;
}

export async function updateTicket(id, updates) {
  const tickets = readTickets();

  const exists = tickets.some((ticket) => ticket.id === id);

  if (!exists) {
    throw new Error("Ticket not found");
  }

  const updatedTickets = tickets.map((ticket) =>
    ticket.id === id
      ? { ...ticket, ...updates }
      : ticket
  );

  saveTickets(updatedTickets);

  return updatedTickets.find((ticket) => ticket.id === id);
}

export async function deleteTicket(id) {
  const tickets = readTickets();

  const updatedTickets = tickets.filter(
    (ticket) => ticket.id !== id
  );

  if (updatedTickets.length === tickets.length) {
    throw new Error("Ticket not found");
  }

  saveTickets(updatedTickets);

  return id;
}
