import { downloadReport } from "../../services/reportService";
import "../../css/uploadCard.css";

function ReportCard({ sessionId }) {

  const handleDownload = async () => {
    try {
      await downloadReport(sessionId);
    } catch (error) {
      console.error(error);
      alert("Failed to download report.");
    }
  };

  return (
    <div className="action-card">
      <h3>📊 Reports</h3>

      <p>
        Download the buffet summary report.
      </p>

      <button onClick={handleDownload}>
        Download Report
      </button>
    </div>
  );
}

export default ReportCard;