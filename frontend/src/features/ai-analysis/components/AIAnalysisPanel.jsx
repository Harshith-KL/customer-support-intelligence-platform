
import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

import {
  PsychologyRounded,
  CheckCircleRounded,
  HistoryRounded,
} from "@mui/icons-material";

import {
  analyzeTicket,
  getAnalysisHistory,
} from "../services/aiAnalysisService";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "../../../utils/constants";

function AIAnalysisPanel({ ticket, onAccept, accepting }) {
  const [analysis, setAnalysis] = useState(null);
  const [reviewCategory, setReviewCategory] = useState("");
  const [reviewPriority, setReviewPriority] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");

  async function loadHistory() {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const result = await getAnalysisHistory(ticket.id);
      setHistory(result.items || []);
    } catch (err) {
      setHistoryError(
        err.response?.data?.detail ||
          "Unable to load analysis history."
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleAnalyze() {
    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const result = await analyzeTicket(ticket.id);

      setAnalysis(result);
      setReviewCategory(result.category_recommendation);
      setReviewPriority(result.priority_recommendation);
      await loadHistory();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to analyse this ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <PsychologyRounded color="primary" />

        <Typography variant="h6">
          AI Ticket Analysis
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Powered by OpenRouter. Recommendations are
        suggestions and require human approval before
        updating the ticket.
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
          <CircularProgress size={26} />
          <Typography variant="body2" color="text.secondary" mt={1}>
            OpenRouter is analysing the ticket...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {analysis && (
        <Stack mt={3} spacing={2} sx={{ minWidth: 0 }}>
          <Typography variant="h6">
            Review AI Recommendations
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip
              color="primary"
              label={`AI category: ${analysis.category_recommendation}`}
            />

            <Chip
              color="warning"
              label={`AI priority: ${analysis.priority_recommendation}`}
            />

            {analysis.sentiment && (
              <Chip label={`Sentiment: ${analysis.sentiment}`} />
            )}

            {analysis.confidence_score != null && (
              <Chip
                color="success"
                label={`Confidence: ${(
                  analysis.confidence_score * 100
                ).toFixed(0)}%`}
              />
            )}
          </Box>

          <Divider />

          <Box>
            <Typography fontWeight={600} mb={1}>
              Issue Summary
            </Typography>

            <Typography color="text.secondary">
              {analysis.summary}
            </Typography>
          </Box>

          <Box>
            <Typography fontWeight={600} mb={1}>
              Recommendation Reason
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "background.default" }}
            >
              <Typography whiteSpace="pre-wrap">
                {analysis.reason}
              </Typography>
            </Paper>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <TextField
              select
              label="Final category"
              value={reviewCategory}
              onChange={(event) => setReviewCategory(event.target.value)}
              fullWidth
            >
              {TICKET_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Final priority"
              value={reviewPriority}
              onChange={(event) => setReviewPriority(event.target.value)}
              fullWidth
            >
              {TICKET_PRIORITIES.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 0.25, sm: 2 }}
            useFlexGap
            sx={{ minWidth: 0, flexWrap: "wrap" }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ overflowWrap: "anywhere" }}
            >
              Model: {analysis.model_name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ overflowWrap: "anywhere" }}
            >
              Provider: {analysis.provider}
            </Typography>
          </Stack>

          {analysis.suggested_response && (
            <Box>
              <Typography fontWeight={600} mb={1}>
                Suggested Customer Response
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, bgcolor: "background.default" }}
              >
                <Typography whiteSpace="pre-wrap">
                  {analysis.suggested_response}
                </Typography>
              </Paper>
            </Box>
          )}

          <Box sx={{ display: "flex", width: "100%", minWidth: 0 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleRounded />}
              onClick={() =>
                onAccept(analysis.id, {
                  category: reviewCategory,
                  priority: reviewPriority,
                })
              }
              disabled={accepting}
              sx={{
                width: { xs: "100%", sm: "auto" },
                maxWidth: "100%",
                whiteSpace: "normal",
                overflowWrap: "anywhere",
              }}
            >
              {accepting
                ? "Applying..."
                : "Accept Recommendations"}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ overflowWrap: "anywhere" }}
          >
            Only category and priority will be updated.
            Summary and reason remain saved with the analysis.
          </Typography>
        </Stack>
      )}

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HistoryRounded color="action" />
          <Typography fontWeight={600}>
            Analysis History
          </Typography>
        </Box>

        <Button
          size="small"
          onClick={loadHistory}
          disabled={historyLoading}
        >
          Refresh
        </Button>
      </Box>

      {historyLoading && <CircularProgress size={22} />}

      {historyError && (
        <Alert severity="warning">{historyError}</Alert>
      )}

      {!historyLoading && !historyError && history.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No previous AI analyses found.
        </Typography>
      )}

      {history.map((item) => (
        <Paper
          key={item.id}
          variant="outlined"
          sx={{ p: 2, mb: 1 }}
        >
          <Typography fontWeight={600}>
            Analysis #{item.id}
          </Typography>

          <Typography variant="body2">
            {item.category_recommendation} · {item.priority_recommendation}
            {item.sentiment ? ` · ${item.sentiment}` : ""}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {new Date(item.created_at).toLocaleString()}
          </Typography>
        </Paper>
      ))}
    </Paper>
  );
}

export default AIAnalysisPanel;
