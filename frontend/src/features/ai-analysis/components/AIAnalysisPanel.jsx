
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { PsychologyRounded, CheckCircleRounded } from "@mui/icons-material";

import { useState } from "react";

import { analyzeTicket } from "../services/mockAIService";

import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "../../../utils/constants";

function AIAnalysisPanel({ ticket, onAccept }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const result = await analyzeTicket(ticket);

      setAnalysis(result);
    } catch {
      setError("Unable to analyse this ticket.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setAnalysis((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
      >
        <PsychologyRounded color="primary" />

        <Typography variant="h6">
          AI Ticket Analysis
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Demo mode: recommendations are generated using
        a rule-based mock service, not a live AI model.
      </Alert>

      <Button
        variant="contained"
        startIcon={<PsychologyRounded />}
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "Analysing..." : "Analyse Ticket"}
      </Button>

      {loading && (
        <Box mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {analysis && (
        <Box mt={3} display="flex" flexDirection="column" gap={2}>
          <Typography fontWeight={600}>
            Review Recommendations
          </Typography>

          <TextField
            select
            label="Recommended Category"
            value={analysis.category}
            onChange={(event) =>
              updateField("category", event.target.value)
            }
            fullWidth
          >
            {TICKET_CATEGORIES.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Recommended Priority"
            value={analysis.priority}
            onChange={(event) =>
              updateField("priority", event.target.value)
            }
            fullWidth
          >
            {TICKET_PRIORITIES.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Issue Summary"
            multiline
            rows={3}
            value={analysis.summary}
            onChange={(event) =>
              updateField("summary", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Explanation"
            multiline
            rows={2}
            value={analysis.reason}
            onChange={(event) =>
              updateField("reason", event.target.value)
            }
            fullWidth
          />

          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleRounded />}
            onClick={() => onAccept(analysis)}
          >
            Accept Recommendations
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default AIAnalysisPanel;
