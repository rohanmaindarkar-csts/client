import { ChartNoAxesCombined } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import "./LeadDashboard.css";

export default function LeadDashboard() {
  return (
    <div className="lead-dashboard-page">
      <PageHeader
        title="Lead Dashboard"
        description="Overview of lead performance, pipeline, assignments, and follow-ups."
      />

      <div className="lead-dashboard-placeholder">
        <div className="lead-dashboard-placeholder-icon">
          <ChartNoAxesCombined size={28} strokeWidth={1.5} />
        </div>

        <h3>Lead Analytics Dashboard</h3>

        <p>
          Lead statistics, pipeline overview, conversion analytics, staff
          performance, and follow-up insights will appear here.
        </p>
      </div>
    </div>
  );
}
