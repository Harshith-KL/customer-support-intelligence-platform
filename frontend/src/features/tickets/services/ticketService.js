
import apiClient from "../../../services/apiClient";

function mapTicket(ticket) {
  return {
    id: ticket.ticket_id,
    title: ticket.subject,
    customerName: ticket.customer_id,
    description: ticket.description,
    createdAt: ticket.created_at,
    status: ticket.status,
    category: ticket.category,
    priority: ticket.priority,
    sentiment: ticket.sentiment,
    resolution: ticket.resolution,
  };
}

function mapTicketPayload(data) {
  const payload = {
    customer_id: data.customerName,
    subject: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority,
    status: data.status,
    sentiment: data.sentiment || "Neutral",
    resolution: data.resolution ?? null,
  };

  return payload;
}

export async function getTickets(params = {}) {
  const response = await apiClient.get("/tickets/", {
    params: {
      page: params.page || 1,
      page_size: params.pageSize || 10,
      search: params.search || undefined,
      category: params.category || undefined,
      priority: params.priority || undefined,
      status: params.status || undefined,
      sentiment: params.sentiment || undefined,
      sort_by: params.sortBy || "created_at",
      sort_order: params.sortOrder || "desc",
    },
  });

  return {
    ...response.data,
    items: response.data.items.map(mapTicket),
  };
}

export async function getAllTickets() {
  const firstPage = await getTickets({
    page: 1,
    pageSize: 100,
  });

  if (firstPage.total_pages <= 1) {
    return firstPage.items;
  }

  const remainingPages = await Promise.all(
    Array.from(
      { length: firstPage.total_pages - 1 },
      (_, index) =>
        getTickets({
          page: index + 2,
          pageSize: 100,
        })
    )
  );

  return [
    ...firstPage.items,
    ...remainingPages.flatMap((page) => page.items),
  ];
}

export async function getTicketById(id) {
  const response = await apiClient.get(
    `/tickets/${encodeURIComponent(id)}`
  );

  return mapTicket(response.data);
}

export async function createTicket(data) {
  const ticketId = `TICKET-${crypto.randomUUID()}`;

  const payload = {
    ...mapTicketPayload(data),
    ticket_id: ticketId,
    created_at: new Date().toISOString(),
  };

  const response = await apiClient.post("/tickets/", payload);

  return mapTicket(response.data);
}

export async function updateTicket(id, updates) {
  const payload = {};

  if (updates.title !== undefined) {
    payload.subject = updates.title;
  }

  if (updates.customerName !== undefined) {
    payload.customer_id = updates.customerName;
  }

  if (updates.description !== undefined) {
    payload.description = updates.description;
  }

  if (updates.category !== undefined) {
    payload.category = updates.category;
  }

  if (updates.priority !== undefined) {
    payload.priority = updates.priority;
  }

  if (updates.status !== undefined) {
    payload.status = updates.status;
  }

  if (updates.sentiment !== undefined) {
    payload.sentiment = updates.sentiment;
  }

  if (updates.resolution !== undefined) {
    payload.resolution = updates.resolution;
  }

  const response = await apiClient.put(
    `/tickets/${encodeURIComponent(id)}`,
    payload
  );

  return mapTicket(response.data);
}

export async function deleteTicket(id) {
  await apiClient.delete(
    `/tickets/${encodeURIComponent(id)}`
  );

  return id;
}
