import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import LeadList from "../pages/leads/LeadList";
// import AddLead from "../pages/leads/AddLead";
import LeadForm from "../pages/leads/LeadForm";
import FollowUps from "../pages/FollowUps";
import Assignments from "../pages/Assignments";
import AuditLogs from "../pages/AuditLogs";
import Reports from "../pages/Reports";
import LeadSources from "../pages/LeadSources";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/leads" element={<LeadList />} />

        <Route path="/leads/add" element={<LeadForm />} />

        <Route path="/leads/edit/:id" element={<LeadForm />} />

        <Route path="/follow-ups" element={<FollowUps />} />

        <Route path="/assignments" element={<Assignments />} />

        <Route path="/audit-logs" element={<AuditLogs />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/lead-sources" element={<LeadSources />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
