import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import "./LeadStatusDialog.css";

const actions = {
  Converted: {
    title: "Convert Lead",
    message: "Mark this lead as successfully converted?",
    button: "Confirm Conversion",
  },
  Lost: {
    title: "Mark Lead as Lost",
    message: "Are you sure this opportunity is lost?",
    button: "Mark as Lost",
  },
  Reactivated: {
    title: "Reactivate Lead",
    message: "Move this lead back into the active pipeline?",
    button: "Reactivate Lead",
  },
};

export default function LeadStatusDialog({ lead, action, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setReason("");
    setConfirmed(false);
  }, [lead?.id, action]);

  const config = actions[action];

  const submit = (event) => {
    event.preventDefault();
    if (!lead || !config || !reason.trim() || !confirmed) return;
    onConfirm(lead, action, reason.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={Boolean(lead && config)}
      onClose={onClose}
      title={config?.title || "Change Lead Status"}
      subtitle={lead?.businessName || ""}
      size="sm"
    >
      <form className="lead-status-form" onSubmit={submit}>
        <p>{config?.message}</p>

        <label htmlFor="lead-status-reason">
          Reason <span>*</span>
        </label>
        <textarea
          id="lead-status-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for this status change..."
          required
        />

        <label className="lead-status-confirm">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          I confirm this status change.
        </label>

        <div className="lead-status-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={!reason.trim() || !confirmed}>
            {config?.button}
          </button>
        </div>
      </form>
    </Modal>
  );
}
