
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "../../../utils/constants";

const ticketSchema = z.object({
  title: z.string().trim().min(5, "Minimum 5 characters required"),
  description: z.string().trim().min(10, "Minimum 10 characters required"),
  customerName: z.string().trim().min(2, "Customer name is required"),
  category: z.enum(TICKET_CATEGORIES),
  priority: z.enum(TICKET_PRIORITIES),
  status: z.enum(TICKET_STATUSES),
});

function TicketForm({
  initialValues,
  onSubmit,
  submitLabel = "Create Ticket",
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ticketSchema),

    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      customerName: initialValues?.customerName || "",
      category: initialValues?.category || "General Enquiry",
      priority: initialValues?.priority || "Medium",
      status: initialValues?.status || "Open",
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        maxWidth: 800,
      }}
    >
      <Typography variant="h6">
        Ticket Information
      </Typography>

      <TextField
        label="Ticket Title"
        fullWidth
        {...register("title")}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        label="Customer Name"
        fullWidth
        {...register("customerName")}
        error={!!errors.customerName}
        helperText={errors.customerName?.message}
      />

      <TextField
        label="Description"
        fullWidth
        multiline
        rows={5}
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Category"
            fullWidth
            error={!!errors.category}
            helperText={errors.category?.message}
          >
            {TICKET_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Priority"
            fullWidth
            error={!!errors.priority}
            helperText={errors.priority?.message}
          >
            {TICKET_PRIORITIES.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {initialValues && (
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Status" fullWidth>
              {TICKET_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      )}

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </Box>
    </Box>
  );
}

export default TicketForm;
