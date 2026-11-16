
import {
  Alert,
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
  TICKET_SENTIMENTS,
} from "../../../utils/constants";

const ticketSchema = z.object({
  title: z.string().trim().min(5, "Minimum 5 characters required"),
  description: z.string().trim().min(10, "Minimum 10 characters required"),
  customerName: z.string().trim().min(2, "Customer ID is required"),
  category: z.enum(TICKET_CATEGORIES),
  priority: z.enum(TICKET_PRIORITIES),
  status: z.enum(TICKET_STATUSES),
  sentiment: z.enum(TICKET_SENTIMENTS),
});

function TicketForm({
  initialValues,
  onSubmit,
  submitLabel = "Create Ticket",
  isSubmitting = false,
  submitError,
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      customerName: initialValues?.customerName || "",
      category: initialValues?.category || "Other",
      priority: initialValues?.priority || "Medium",
      status: initialValues?.status || "Open",
      sentiment: initialValues?.sentiment || "Neutral",
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
        label="Customer ID"
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

      {[
        {
          name: "category",
          label: "Category",
          options: TICKET_CATEGORIES,
        },
        {
          name: "priority",
          label: "Priority",
          options: TICKET_PRIORITIES,
        },
        {
          name: "sentiment",
          label: "Sentiment",
          options: TICKET_SENTIMENTS,
        },
        ...(initialValues
          ? [{
              name: "status",
              label: "Status",
              options: TICKET_STATUSES,
            }]
          : []),
      ].map((fieldConfig) => (
        <Controller
          key={fieldConfig.name}
          name={fieldConfig.name}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label={fieldConfig.label}
              fullWidth
              error={!!errors[fieldConfig.name]}
              helperText={errors[fieldConfig.name]?.message}
            >
              {fieldConfig.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      ))}

      {submitError && (
        <Alert severity="error">{submitError}</Alert>
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
