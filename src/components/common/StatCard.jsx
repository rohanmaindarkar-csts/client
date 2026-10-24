
import { ArrowUpRight } from "lucide-react";
import "./StatCard.css";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  description,
  onClick,
}) {
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("en-IN")
      : value ?? "—";

  const content = (
    <>
      <div className="stat-card-top">
        <div className={`stat-icon stat-icon-${color}`}>
          {Icon && <Icon size={20} strokeWidth={1.8} />}
        </div>

        {onClick && (
          <ArrowUpRight size={17} className="stat-card-arrow" />
        )}
      </div>

      <div className="stat-card-body">
        <p className="stat-card-title">{title}</p>
        <h2 className="stat-card-value">{formattedValue}</h2>
        {description && (
          <p className="stat-card-description">{description}</p>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="stat-card stat-card-clickable"
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return <div className="stat-card">{content}</div>;
}
