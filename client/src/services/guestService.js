import api from "./api";

// Get guests
export const getGuests = (sessionId) =>
  api.get(`/guests/${sessionId}`);

// Update guest status
export const updateGuestStatus = (guestId, claimed) =>
  api.patch(`/guests/${guestId}/status`, {
    claimed,
  });