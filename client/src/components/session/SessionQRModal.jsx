import { QRCodeCanvas } from "qrcode.react";

function SessionQRModal({
  open,
  onClose,
  session,
}) {
  if (!open || !session) {
    return null;
  }

  // Existing Staff Page URL
  const staffUrl =
    `${window.location.origin}/staff/${session.sessionCode}`;

  const handleDownload = () => {
    const canvas = document.getElementById(
      "staff-session-qr"
    );

    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace(
        "image/png",
        "image/octet-stream"
      );

    const downloadLink =
      document.createElement("a");

    downloadLink.href = pngUrl;

    downloadLink.download =
      `staff-qr-${session.sessionCode}.png`;

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();

    document.body.removeChild(
      downloadLink
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0, 0, 0, 0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "400px",
          maxWidth: "90%",
          background: "#fff",
          borderRadius: "16px",
          padding: "25px",
          textAlign: "center",
          boxShadow:
            "0 15px 40px rgba(0,0,0,0.2)",
        }}
      >

        <h2>
          Staff Access QR Code
        </h2>

        <p
          style={{
            color: "#666",
            marginBottom: "20px",
          }}
        >
          Scan this QR code to open
          the Staff Page for this session.
        </p>

        {/* QR */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <QRCodeCanvas
            id="staff-session-qr"
            value={staffUrl}
            size={240}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Session Code */}
        <p>
          <strong>
            Session Code:
          </strong>{" "}
          {session.sessionCode}
        </p>

        {/* Staff URL */}
        <p
          style={{
            fontSize: "13px",
            color: "#777",
            wordBreak: "break-all",
          }}
        >
          {staffUrl}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >

          <button
            onClick={handleDownload}
            style={{
              padding:
                "10px 18px",
              border: "none",
              borderRadius: "8px",
              background:
                "#4f46e5",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Download QR
          </button>

          <button
            onClick={onClose}
            style={{
              padding:
                "10px 18px",
              border:
                "1px solid #ddd",
              borderRadius: "8px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}

export default SessionQRModal;