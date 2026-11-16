
import {
  Alert,
  Box,
  Button,
  Grid,
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
        maxWidth: 880,
      }}
    >
      <Typography variant="h6" mb={2.5}>
        Ticket Information
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <TextField
            label="Ticket Title"
            fullWidth
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            label="Customer ID"
            fullWidth
            {...register("customerName")}
            error={!!errors.customerName}
            helperText={errors.customerName?.message}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={5}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Grid>
        {[
          {
            name: "category",
            label: "Category",
            options: TICKET_CATEGORIES,
            size: { xs: 12, sm: 6 },
          },
          {
            name: "priority",
            label: "Priority",
            options: TICKET_PRIORITIES,
            size: { xs: 12, sm: 6 },
          },
          {
            name: "sentiment",
            label: "Sentiment",
            options: TICKET_SENTIMENTS,
            size: { xs: 12, sm: 6 },
          },
          ...(initialValues
            ? [{
              name: "status",
              label: "Status",
              options: TICKET_STATUSES,
              size: { xs: 12, sm: 6 },
            }]
            : []),
        ].map((fieldConfig) => (
          <Grid key={fieldConfig.name} size={fieldConfig.size}>
            <Controller
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
          </Grid>
        ))}

        {submitError && (
          <Grid size={12}>
            <Alert severity="error">{submitError}</Alert>
          </Grid>
        )}

        <Grid size={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TicketForm;
