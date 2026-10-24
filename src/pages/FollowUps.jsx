
import { CalendarClock } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import "./FollowUps.css";

export default function FollowUps() {
  return (
    <div className="followups-page">
      <PageHeader
        title="Follow-ups"
        description="Manage scheduled, upcoming and overdue follow-ups."
      />

      <div className="followups-content">
        <CalendarClock size={36} strokeWidth={1.5} />
        <h3>Follow-up Management</h3>
        <p>Scheduled follow-up records will appear here.</p>
      </div>
    </div>
  );
}
