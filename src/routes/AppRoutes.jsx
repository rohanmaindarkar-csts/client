import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import LeadList from "../pages/leads/LeadList";
// import AddLead from "../pages/leads/AddLead";
import LeadForm from "../pages/leads/LeadForm";
import Assignments from "../pages/assignments/Assignments";
import FollowUps from "../pages/followups/FollowUps";
import AuditLogs from "../pages/AuditLogs";
import Reports from "../pages/Reports";
import LeadSources from "../pages/LeadSources";
import FollowUpCalendar from "../pages/followups/FollowUpCalendar";

import LeadDashboard from "../pages/leadDashboard/LeadDashboard";
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
        <Route path="/follow-ups/calendar" element={<FollowUpCalendar />} />
        <Route path="/lead-dashboard" element={<LeadDashboard />} />
        <Route path="/assignments" element={<Assignments />} />

        <Route path="/audit-logs" element={<AuditLogs />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/lead-sources" element={<LeadSources />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
