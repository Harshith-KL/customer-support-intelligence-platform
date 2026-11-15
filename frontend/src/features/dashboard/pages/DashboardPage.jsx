
import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Alert,
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
  getTickets,
  deleteTicket,
} from "../../tickets/services/ticketService";

function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all tickets
  const {
    data: tickets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  // Delete ticket mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTicket,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });

  // Loading state
  if (isLoading) {
    return <CircularProgress />;
  }

  // Error state
  if (isError) {
    return (
      <Alert severity="error">
        Unable to load dashboard.
      </Alert>
    );
  }

  // Calculate dashboard statistics
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

  // Statistics cards
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

  // Get latest five tickets
  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <Box>
      {/* Dashboard Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4">
            Dashboard
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
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

      {/* Statistics Cards */}
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

      {/* Recent Tickets Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6">
            Recent Tickets
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Latest customer support requests.
          </Typography>
        </Box>

        <Button onClick={() => navigate("/tickets")}>
          View All
        </Button>
      </Box>

      {/* Recent Tickets Table */}
      <TicketTable
        tickets={recentTickets}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </Box>
  );
}

export default DashboardPage;
