import "./StatusBadge.css";

const statusVariants = {
  new: "info",
  contacted: "info",
  pending: "warning",
  completed: "success",
  converted: "success",
  overdue: "danger",
  lost: "danger",
  rescheduled: "purple",
  cancelled: "neutral",
  assigned: "purple",
  unassigned: "neutral",
};

export default function StatusBadge({ status = "" }) {
  const normalizedStatus = String(status)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const variant = statusVariants[normalizedStatus] || "neutral";

  const label = String(status)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <span className={`status-badge status-badge-${variant}`}>{label}</span>
  );
}
