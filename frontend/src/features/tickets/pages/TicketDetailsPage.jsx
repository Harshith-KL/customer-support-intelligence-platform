
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useNavigate, useParams } from "react-router-dom";

import {
  getTicketById,
  updateTicket,
} from "../services/ticketService";

import AIAnalysisPanel from "../../ai-analysis/components/AIAnalysisPanel";

import {
  QUERY_KEYS,
  TICKET_STATUSES,
} from "../../../utils/constants";

function TicketDetailsPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.ticket(ticketId),
    queryFn: () => getTicketById(ticketId),
  });

  const mutation = useMutation({
    mutationFn: (updates) => updateTicket(ticketId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tickets,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dashboardTickets,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ticket(ticketId),
      });
    },
  });

  if (isLoading) return <CircularProgress />;

  if (isError) {
    return (
      <Alert severity="error">
        Unable to load ticket:{" "}
        {error?.response?.data?.detail || error.message}
      </Alert>
    );
  }

  if (!ticket) {
    return <Alert severity="warning">Ticket not found.</Alert>;
  }

  const handleStatusChange = (event) => {
    mutation.mutate({
      status: event.target.value,
    });
  };

  const handleAcceptAnalysis = (analysis) => {
    mutation.mutate({
      category: analysis.category,
      priority: analysis.priority,
    });
  };

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
            Ticket Details
          </Typography>

          <Typography color="text.secondary">
            {ticket.id}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate(`/tickets/${ticketId}/edit`)}
        >
          Edit Ticket
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          {ticket.title}
        </Typography>

        <Typography color="text.secondary" mb={3}>
          {ticket.description}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <Chip label={ticket.category} />
          <Chip label={`Priority: ${ticket.priority}`} />
          <Chip label={`Status: ${ticket.status}`} />
          <Chip label={`Sentiment: ${ticket.sentiment}`} />
        </Box>

        <Typography variant="body2">
          Customer ID: {ticket.customerName}
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={1}>
          Created: {new Date(ticket.createdAt).toLocaleString()}
        </Typography>

        {ticket.resolution && (
          <Box mt={2}>
            <Typography variant="subtitle2">
              Resolution
            </Typography>
            <Typography variant="body2">
              {ticket.resolution}
            </Typography>
          </Box>
        )}

        <TextField
          select
          label="Update Status"
          value={ticket.status}
          onChange={handleStatusChange}
          disabled={mutation.isPending}
          size="small"
          sx={{ mt: 3, minWidth: 200 }}
        >
          {TICKET_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        {mutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Unable to update ticket.
          </Alert>
        )}
      </Paper>

      <AIAnalysisPanel
        ticket={ticket}
        onAccept={handleAcceptAnalysis}
      />
    </Box>
  );
}

export default TicketDetailsPage;
