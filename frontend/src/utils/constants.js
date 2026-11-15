
export const TICKET_CATEGORIES = [
  "Technical Issue",
  "Billing",
  "Account Access",
  "Feature Request",
  "General Enquiry",
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
];

export const QUERY_KEYS = {
  tickets: ["tickets"],
  ticket: (id) => ["ticket", id],
};
