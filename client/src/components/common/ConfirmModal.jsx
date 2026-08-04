import "../../css/confirmModal.css";

function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="confirm-btn"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;