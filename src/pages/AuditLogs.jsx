import { ScrollText } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import "./AuditLogs.css";

export default function AuditLogs() {
  return (
    <div className="audit-logs-page">
      <PageHeader
        title="Audit Logs"
        description="Track lead activities and system changes."
      />

      <div className="audit-logs-content">
        <ScrollText size={36} strokeWidth={1.5} />
        <h3>Activity History</h3>
        <p>Lead activity and audit records will appear here.</p>
      </div>
    </div>
  );
}
