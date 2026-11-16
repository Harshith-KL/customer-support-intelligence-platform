
import { Box, Paper, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import TicketForm from "../components/TicketForm";
import { createTicket } from "../services/ticketService";
import { QUERY_KEYS } from "../../../utils/constants";

function CreateTicketPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tickets,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dashboardTickets,
      });

      navigate(`/tickets/${ticket.id}`);
    },
  });

  return (
    <Box>
      <Typography variant="h4" mb={1}>
        Create Ticket
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Create a new customer support request.
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <TicketForm
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

export default CreateTicketPage;
