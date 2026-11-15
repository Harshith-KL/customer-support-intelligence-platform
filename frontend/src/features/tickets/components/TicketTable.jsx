import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Delete,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

function TicketTable({ tickets, onDelete }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      Open: "info",
      "In Progress": "warning",
      Resolved: "success",
    };

    return colors[status] || "default";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "default",
      Medium: "info",
      High: "warning",
      Critical: "error",
    };

    return colors[priority] || "default";
  };

  if (!tickets.length) {
    return (
      <Paper sx={{ p: 5, textAlign: "center" }}>
        <Typography color="text.secondary">
          No tickets found.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ticket ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {ticket.id}
                </Typography>
              </TableCell>

              <TableCell>{ticket.title}</TableCell>

              <TableCell>{ticket.customerName}</TableCell>

              <TableCell>{ticket.category}</TableCell>

              <TableCell>
                <Chip
                  label={ticket.priority}
                  size="small"
                  color={getPriorityColor(ticket.priority)}
                />
              </TableCell>

              <TableCell>
                <Chip
                  label={ticket.status}
                  size="small"
                  color={getStatusColor(ticket.status)}
                />
              </TableCell>

              <TableCell align="right">
                <Tooltip title="View">
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/tickets/${ticket.id}`);
                    }}
                  >
                    <VisibilityOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/tickets/${ticket.id}/edit`);
                    }}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={(event) => {
                      event.stopPropagation();

                      if (window.confirm("Delete this ticket?")) {
                        onDelete(ticket.id);
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TicketTable;
