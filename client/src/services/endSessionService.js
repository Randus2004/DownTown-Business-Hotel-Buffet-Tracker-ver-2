import api from "./api";

export const endSession = (sessionId) =>
  api.patch(`/sessions/${sessionId}/end`);