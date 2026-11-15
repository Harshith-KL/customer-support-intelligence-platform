
import { Box, Paper, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import TicketForm from "../components/TicketForm";
import { createTicket } from "../services/ticketService";

function CreateTicketPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTicket,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      navigate("/tickets");
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
        />
      </Paper>
    </Box>
  );
}

export default CreateTicketPage;
