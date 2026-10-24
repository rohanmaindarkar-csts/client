import { useLocation } from "react-router-dom";
import { Bell, ChevronDown, Menu, UserRound } from "lucide-react";

import { menuItems } from "../../config/menuItems";
import "../../styles/Header.css";

export default function Header({ setMobileOpen, setCollapsed }) {
  const location = useLocation();

  const getPageTitle = () => {
    for (const item of menuItems) {
      if (item.path === location.pathname) {
        return item.label;
      }

      const child = item.children?.find(
        (child) => child.path === location.pathname,
      );

      if (child) return child.label;
    }

    if (location.pathname.startsWith("/leads/edit/")) {
      return "Edit Lead";
    }

    return "Dashboard";
  };

  const openMobileSidebar = () => {
    setCollapsed(false);
    setMobileOpen(true);
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          type="button"
          className="header-icon-button header-menu-button"
          onClick={openMobileSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* <div className="header-page-info">
          <h2>{getPageTitle()}</h2>
          <p>Lead Management System</p>
        </div> */}
      </div>

      <div className="header-right">
        <button
          type="button"
          className="header-icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        <div className="header-profile">
          <div className="profile-avatar">
            <UserRound size={19} />
          </div>

          <div className="profile-details">
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>
          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}
