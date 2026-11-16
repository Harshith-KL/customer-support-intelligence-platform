
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TicketTable from "../components/TicketTable";
import { deleteTicket, getTickets } from "../services/ticketService";
import {
  QUERY_KEYS,
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
  const [page, setPage] = useState(1);

  const filters = {
    page,
    pageSize: 10,
    search,
    category,
    priority,
    status,
  };

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [...QUERY_KEYS.tickets, filters],
    queryFn: () => getTickets(filters),
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tickets,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dashboardTickets,
      });
    },
  });

  const tickets = data?.items ?? [];

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPriority("");
    setStatus("");
    setPage(1);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Alert severity="error">
        Unable to load tickets:{" "}
        {error?.response?.data?.detail || error.message}
      </Alert>
    );
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
          <Typography variant="h4">Tickets</Typography>
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

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          size="small"
          placeholder="Search tickets..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 220, flexGrow: 1 }}
        />

        {[
          {
            label: "Category",
            value: category,
            setter: setCategory,
            options: TICKET_CATEGORIES,
          },
          {
            label: "Priority",
            value: priority,
            setter: setPriority,
            options: TICKET_PRIORITIES,
          },
          {
            label: "Status",
            value: status,
            setter: setStatus,
            options: TICKET_STATUSES,
          },
        ].map((filter) => (
          <TextField
            key={filter.label}
            select
            size="small"
            label={filter.label}
            value={filter.value}
            onChange={(event) => {
              filter.setter(event.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All {filter.label}s</MenuItem>
            {filter.options.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        ))}

        <Button color="inherit" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Box>

      <Typography color="text.secondary" variant="body2" mb={1.5}>
        Showing {tickets.length} of {data?.total ?? 0} tickets
      </Typography>

      <TicketTable
        tickets={tickets}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {data?.total_pages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={data.total_pages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Unable to delete ticket.
        </Alert>
      )}
    </Box>
  );
}

export default TicketsPage;
