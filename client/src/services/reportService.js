import api from "./api";

export const downloadReport = async (sessionId) => {
  const response = await api.get(
    `/reports/${sessionId}`,
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;

  link.download = "Buffet_Report.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();
};