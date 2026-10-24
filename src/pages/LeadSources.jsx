import { Database } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import "./LeadSources.css";

export default function LeadSources() {
  return (
    <div className="lead-sources-page">
      <PageHeader
        title="Lead Sources"
        description="Manage and track lead acquisition sources."
      />

      <div className="lead-sources-content">
        <Database size={36} strokeWidth={1.5} />
        <h3>Lead Source Management</h3>
        <p>Lead source records will appear here.</p>
      </div>
    </div>
  );
}
