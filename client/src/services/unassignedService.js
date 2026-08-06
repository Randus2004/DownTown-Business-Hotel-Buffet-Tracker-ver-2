import api from "./api";

// Get all unassigned guests
export const getUnassignedGuests = (sessionId) =>
  api.get(`/unassigned/${sessionId}`);

// Add unassigned guest
export const addUnassignedGuest = (data) =>
  api.post("/unassigned", data);

// Update claim status
export const updateUnassignedGuestStatus = (
  guestId,
  claimed
) =>
  api.patch(`/unassigned/${guestId}`, {
    claimed,
  });