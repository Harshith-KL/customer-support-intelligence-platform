
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Pagination,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AddRounded, SearchRounded } from "@mui/icons-material";
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
  const hasFilters = Boolean(search || category || priority || status);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPriority("");
    setStatus("");
    setPage(1);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "grid", minHeight: 240, placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
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
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
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

      <Paper
        variant="outlined"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "minmax(240px, 1.5fr) repeat(3, minmax(140px, 1fr)) auto",
          },
          alignItems: "center",
          gap: { xs: 1.25, sm: 1.5 },
          p: { xs: 1.5, sm: 2 },
          mb: 2,
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <TextField
          size="medium"
          placeholder="Search tickets..."
          aria-label="Search tickets"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <Box component="span" sx={{ display: "flex", mr: 1 }}>
                  <SearchRounded color="action" fontSize="small" />
                </Box>
              ),
            },
          }}
          sx={{ minWidth: 0 }}
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
            size="medium"
            label={filter.label}
            value={filter.value}
            onChange={(event) => {
              filter.setter(event.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 0 }}
          >
            <MenuItem value="">All {filter.label}s</MenuItem>
            {filter.options.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        ))}

        <Button
          color="inherit"
          onClick={clearFilters}
          disabled={!hasFilters}
          sx={{
            justifySelf: { xs: "stretch", sm: "end" },
            gridColumn: { xs: "auto", sm: "1 / -1", lg: "auto" },
            whiteSpace: "nowrap",
          }}
        >
          Clear Filters
        </Button>
      </Paper>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1.5,
          px: 0.25,
        }}
      >
        <Typography color="text.secondary" variant="body2">
          Showing {tickets.length} of {data?.total ?? 0} tickets
        </Typography>
      </Box>

      <TicketTable
        tickets={tickets}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {data?.total_pages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            mt: 3,
            "& .MuiPagination-ul": {
              justifyContent: "center",
              flexWrap: "wrap",
            },
          }}
        >
          <Pagination
            count={data.total_pages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            siblingCount={0}
            boundaryCount={1}
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
