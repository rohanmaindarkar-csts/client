import { Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/common/PageHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import { dashboardStats } from "../data/dashboardData";

import "../styles/Dashboard.css";
import Button from "../components/common/Button";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Lead Management Dashboard"
        description="Overview of leads, conversions and follow-up activities."
      >
        <Button
          variant="outlined"
          icon={RefreshCw}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate("/leads/add")}
        >
          Add New Lead
        </Button>
      </PageHeader>

      <section className="dashboard-section">
        {/* <DashboardStats stats={dashboardStats} /> */}
      </section>
    </div>
  );
}
