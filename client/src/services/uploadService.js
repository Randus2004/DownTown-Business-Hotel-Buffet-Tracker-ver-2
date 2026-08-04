import api from "./api";

export const uploadGuests = (sessionId, file) => {
  const formData = new FormData();

  formData.append("file", file);

  return api.post(`/upload/${sessionId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};