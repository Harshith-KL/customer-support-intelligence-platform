
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import DashboardPage from "../features/dashboard/pages/DashboardPage";

import TicketsPage from "../features/tickets/pages/TicketsPage";
import CreateTicketPage from "../features/tickets/pages/CreateTicketPage";
import EditTicketPage from "../features/tickets/pages/EditTicketPage";
import TicketDetailsPage from "../features/tickets/pages/TicketDetailsPage";

import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h4">
        404 - Page Not Found
      </Typography>

      <Button
        sx={{ mt: 2 }}
        variant="contained"
        onClick={() => navigate("/")}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="tickets" element={<TicketsPage />} />

          <Route
            path="tickets/new"
            element={<CreateTicketPage />}
          />

          <Route
            path="tickets/:ticketId"
            element={<TicketDetailsPage />}
          />

          <Route
            path="tickets/:ticketId/edit"
            element={<EditTicketPage />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
