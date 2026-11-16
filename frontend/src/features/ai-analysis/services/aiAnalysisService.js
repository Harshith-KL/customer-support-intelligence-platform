
import apiClient from "../../../services/apiClient";

export async function analyzeTicket(ticketId) {
  const response = await apiClient.post(
    `/tickets/${encodeURIComponent(ticketId)}/analyze`
  );

  return response.data;
}

export async function getAnalysisHistory(ticketId) {
  const response = await apiClient.get(
    `/tickets/${encodeURIComponent(ticketId)}/analyses`
  );

  return response.data;
}

export async function acceptAnalysis(
  ticketId,
  analysisId,
  recommendations,
) {
  const response = await apiClient.post(
    `/tickets/${encodeURIComponent(ticketId)}/analyses/${analysisId}/accept`,
    recommendations,
  );

  return response.data;
}
