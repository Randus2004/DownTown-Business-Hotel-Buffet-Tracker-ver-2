import api from "./api";

// Get all sessions
export const getSessions = () =>
  api.get("/sessions");

// Get session by MongoDB ID
export const getSession = (id) =>
  api.get(`/sessions/${id}`);

// Get session by Session Code (for Staff Page)
export const getSessionByCode = (sessionCode) =>
  api.get(`/sessions/code/${sessionCode}`);

// Create a new session
export const createSession = (data) =>
  api.post("/sessions", data);