
const categoryRules = [
  {
    category: "Billing",
    keywords: [
      "payment",
      "charged",
      "invoice",
      "refund",
      "billing",
      "subscription",
    ],
  },
  {
    category: "Account Access",
    keywords: [
      "login",
      "password",
      "account",
      "access",
      "credentials",
    ],
  },
  {
    category: "Feature Request",
    keywords: [
      "feature",
      "request",
      "export",
      "improvement",
      "enhancement",
    ],
  },
  {
    category: "Technical Issue",
    keywords: [
      "error",
      "crash",
      "slow",
      "loading",
      "unavailable",
      "bug",
      "server",
    ],
  },
];

export async function analyzeTicket(ticket) {
  const text = `${ticket.title} ${ticket.description}`.toLowerCase();

  const matchedRule = categoryRules.find((rule) =>
    rule.keywords.some((keyword) => text.includes(keyword))
  );

  const category = matchedRule?.category || "General Enquiry";

  let priority = "Low";

  if (
    /unavailable|outage|security breach|data loss|business stopped/.test(text)
  ) {
    priority = "Critical";
  } else if (
    /unable|cannot|can't|charged twice|duplicate|failed|urgent/.test(text)
  ) {
    priority = "High";
  } else if (
    /issue|problem|error|not working|delay/.test(text)
  ) {
    priority = "Medium";
  }

  const description = ticket.description.trim();

  const summary =
    description.length > 160
      ? `${description.slice(0, 157)}...`
      : description;

  const reason =
    `The ticket contains terms associated with ${category}. ` +
    `Its reported impact and urgency suggest a ${priority} priority.`;

  return {
    category,
    priority,
    summary,
    reason,
  };
}
