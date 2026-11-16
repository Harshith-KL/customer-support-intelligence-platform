
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useNavigate, useParams } from "react-router-dom";

import TicketForm from "../components/TicketForm";
import {
  getTicketById,
  updateTicket,
} from "../services/ticketService";

import { QUERY_KEYS } from "../../../utils/constants";

function EditTicketPage() {
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

      navigate(`/tickets/${ticketId}`);
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

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Edit Ticket
      </Typography>

      <Paper sx={{ p: 3 }}>
        <TicketForm
          initialValues={ticket}
          submitLabel="Save Changes"
          onSubmit={(data) => mutation.mutateAsync(data)}
          isSubmitting={mutation.isPending}
          submitError={
            mutation.error?.response?.data?.detail ||
            mutation.error?.message
          }
        />
      </Paper>
    </Box>
  );
}

export default EditTicketPage;
