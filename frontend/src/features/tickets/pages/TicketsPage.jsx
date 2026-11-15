
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { AddRounded } from "@mui/icons-material";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import TicketTable from "../components/TicketTable";

import {
  getTickets,
  deleteTicket,
} from "../services/ticketService";

import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "../../../utils/constants";

function TicketsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const {
    data: tickets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        ticket.title.toLowerCase().includes(searchText) ||
        ticket.description.toLowerCase().includes(searchText) ||
        ticket.id.toLowerCase().includes(searchText);

      const matchesCategory =
        !category || ticket.category === category;

      const matchesPriority =
        !priority || ticket.priority === priority;

      const matchesStatus =
        !status || ticket.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [tickets, search, category, priority, status]);

  if (isLoading) return <CircularProgress />;

  if (isError) {
    return <Alert severity="error">Unable to load tickets.</Alert>;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4">
            Tickets
          </Typography>

          <Typography color="text.secondary">
            Manage and track customer support tickets.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => navigate("/tickets/new")}
        >
          Create Ticket
        </Button>
      </Box>

      <Box
        display="flex"
        gap={2}
        flexWrap="wrap"
        mb={3}
      >
        <TextField
          size="small"
          placeholder="Search tickets..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: 220, flexGrow: 1 }}
        />

        <TextField
          select
          size="small"
          label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {TICKET_CATEGORIES.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All Priorities</MenuItem>
          {TICKET_PRIORITIES.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          {TICKET_STATUSES.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        <Button
          color="inherit"
          onClick={() => {
            setSearch("");
            setCategory("");
            setPriority("");
            setStatus("");
          }}
        >
          Clear Filters
        </Button>
      </Box>

      <Typography color="text.secondary" variant="body2" mb={1.5}>
        Showing {filteredTickets.length} of {tickets.length} tickets
      </Typography>

      <TicketTable
        tickets={filteredTickets}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </Box>
  );
}

export default TicketsPage;
