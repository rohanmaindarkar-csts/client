
import { ClipboardList } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import "./Assignments.css";

export default function Assignments() {
  return (
    <div className="assignments-page">
      <PageHeader
        title="Lead Assignments"
        description="Manage lead assignments and team responsibilities."
      />

      <div className="assignments-content">
        <ClipboardList size={36} strokeWidth={1.5} />
        <h3>Lead Assignments</h3>
        <p>Assigned and unassigned leads will appear here.</p>
      </div>
    </div>
  );
}
