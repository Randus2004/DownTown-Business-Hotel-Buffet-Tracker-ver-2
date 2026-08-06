import { useState } from "react";
import { uploadGuests } from "../../services/uploadService";
import "../../css/uploadCard.css";

function UploadCard({
  session,
  onUploadSuccess,
  onAddUnassigned,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const isClosed = session.status === "Closed";

  const handleUpload = async () => {
    if (isClosed) {
      alert("This session has been closed.");
      return;
    }

    if (!selectedFile) {
      alert("Please select an Excel file.");
      return;
    }

    try {
      setLoading(true);

      const res = await uploadGuests(
        session._id,
        selectedFile
      );

      alert(res.data.message);

      setSelectedFile(null);

      onUploadSuccess?.();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-card">
      <h3>📤 Upload Guest List</h3>

      <input
        type="file"
        accept=".xlsx,.xls"
        disabled={isClosed}
        onChange={(e) =>
          setSelectedFile(e.target.files[0])
        }
      />

      {selectedFile && <p>{selectedFile.name}</p>}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <button
          onClick={handleUpload}
          disabled={loading || isClosed}
        >
          {isClosed
            ? "Session Closed"
            : loading
            ? "Uploading..."
            : "Upload Guests"}
        </button>

        <button
          type="button"
          onClick={onAddUnassigned}
          disabled={isClosed}
        >
          + Add Unassigned
        </button>
      </div>
    </div>
  );
}

export default UploadCard;