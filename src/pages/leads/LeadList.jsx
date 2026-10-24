import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import "./LeadList.css";
import Button from "../../components/common/Button";

export default function LeadList() {
  const navigate = useNavigate();

  return (
    <div className="lead-list-page">
      <PageHeader
        title="All Leads"
        description="View, search and manage your leads."
      >
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate("/leads/add")}
        >
          Add New Lead
        </Button>
      </PageHeader>

      <div className="lead-list-content">
        <div className="lead-list-empty">
          <Users size={36} strokeWidth={1.5} />
          <h3>Lead Management</h3>
          <p>Lead records, filters and listing table will appear here.</p>
        </div>
      </div>
    </div>
  );
}
