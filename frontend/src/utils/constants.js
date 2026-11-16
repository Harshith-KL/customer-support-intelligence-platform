
export const TICKET_CATEGORIES = [
  "Account",
  "Billing",
  "Delivery",
  "Other",
  "Product",
  "Technical",
];

export const TICKET_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const TICKET_STATUSES = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

export const TICKET_SENTIMENTS = [
  "Positive",
  "Neutral",
  "Negative",
];

export const QUERY_KEYS = {
  tickets: ["tickets"],
  ticket: (id) => ["ticket", id],
  dashboardTickets: ["dashboard-tickets"],
};
