import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

import "../../styles/DashboardLayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={`dashboard-main ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Header setMobileOpen={setMobileOpen} setCollapsed={setCollapsed} />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
