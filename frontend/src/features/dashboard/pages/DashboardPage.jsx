
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import {
  ConfirmationNumberRounded,
  HourglassTopRounded,
  CheckCircleRounded,
  PendingActionsRounded,
  AddRounded,
} from "@mui/icons-material";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import StatCard from "../../../components/common/StatCard";
import TicketTable from "../../tickets/components/TicketTable";

import {
  deleteTicket,
  getAllTickets,
} from "../../tickets/services/ticketService";

import { QUERY_KEYS } from "../../../utils/constants";

function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.dashboardTickets,
    queryFn: getAllTickets,
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

  if (isLoading) return <CircularProgress />;

  if (isError) {
    return (
      <Alert severity="error">
        Unable to load dashboard statistics.
      </Alert>
    );
  }

  const total = tickets.length;

  const open = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgress = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolved = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const stats = [
    {
      title: "Total Tickets",
      value: total,
      icon: <ConfirmationNumberRounded />,
      color: "#2563EB",
    },
    {
      title: "Open Tickets",
      value: open,
      icon: <PendingActionsRounded />,
      color: "#0284C7",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: <HourglassTopRounded />,
      color: "#D97706",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: <CheckCircleRounded />,
      color: "#16A34A",
    },
  ];

  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Overview of your customer support operations.
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

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid
            key={stat.title}
            size={{ xs: 12, sm: 6, lg: 3 }}
          >
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h6">Recent Tickets</Typography>
          <Typography variant="body2" color="text.secondary">
            Latest customer support requests.
          </Typography>
        </Box>

        <Button onClick={() => navigate("/tickets")}>
          View All
        </Button>
      </Box>

      <TicketTable
        tickets={recentTickets}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Unable to delete ticket.
        </Alert>
      )}
    </Box>
  );
}

export default DashboardPage;
