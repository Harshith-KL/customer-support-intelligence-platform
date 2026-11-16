
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
import { ConfirmationNumberOutlined } from "@mui/icons-material";

import {
  Delete,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

function TicketTable({
  tickets = [],
  onDelete,
  emptyMessage = "Try adjusting your search or filters.",
}) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      Open: "info",
      "In Progress": "warning",
      Resolved: "success",
      Closed: "default",
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
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 4, sm: 6 },
          textAlign: "center",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <ConfirmationNumberOutlined
          color="disabled"
          sx={{ fontSize: 36, mb: 1 }}
        />
        <Typography variant="h6" mb={0.5}>
          No tickets found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderColor: "divider",
        borderRadius: 3,
        overflowX: "auto",
      }}
    >
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 190 }}>Ticket ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Customer ID</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right" sx={{ width: 150 }}>
              Actions
            </TableCell>
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
                <Tooltip title={ticket.id}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      maxWidth: 170,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ticket.id}
                  </Typography>
                </Tooltip>
              </TableCell>

              <TableCell sx={{ maxWidth: 320, whiteSpace: "normal" }}>
                {ticket.title}
              </TableCell>
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

              <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                <Tooltip title="View">
                  <IconButton
                    aria-label={`View ticket ${ticket.id}`}
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
                    aria-label={`Edit ticket ${ticket.id}`}
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
                    aria-label={`Delete ticket ${ticket.id}`}
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
