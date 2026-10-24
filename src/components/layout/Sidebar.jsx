import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";

import { menuItems } from "../../config/menuItems";
import "../../styles/Sidebar.css";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const isChildActive = (children = []) =>
    children.some((item) => item.path === location.pathname);

  const toggleMenu = (label, children) => {
    const current = openMenus[label] ?? isChildActive(children);

    setOpenMenus((prev) => ({
      ...prev,
      [label]: !current,
    }));

    if (collapsed) setCollapsed(false);
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      <aside
        className={`sidebar ${
          collapsed ? "collapsed" : ""
        } ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* Sidebar Header */}

        <div className="sidebar-brand">
          <button
            type="button"
            className="brand-logo"
            onClick={() => {
              if (collapsed) {
                setCollapsed(false);
              }
            }}
            title={collapsed ? "Expand Sidebar" : "Lead Manager"}
            aria-label={collapsed ? "Expand Sidebar" : "Lead Manager"}
          >
            L
          </button>

          {!collapsed && (
            <>
              <div className="brand-text">
                <strong>Lead Manager</strong>
                <span>Management System</span>
              </div>

              <button
                type="button"
                className="sidebar-toggle-btn"
                onClick={() => setCollapsed(true)}
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <ChevronLeft size={19} />
              </button>
            </>
          )}

          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={closeMobile}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="sidebar-content">
          {!collapsed && <p className="sidebar-section-label">WORKSPACE</p>}

          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                const isOpen =
                  openMenus[item.label] ?? isChildActive(item.children);

                return (
                  <div className="nav-group" key={item.label}>
                    <button
                      type="button"
                      className={`nav-item ${
                        isChildActive(item.children) ? "parent-active" : ""
                      }`}
                      onClick={() => toggleMenu(item.label, item.children)}
                      title={collapsed ? item.label : undefined}
                      aria-expanded={isOpen}
                    >
                      <Icon size={19} />

                      {!collapsed && (
                        <>
                          <span>{item.label}</span>

                          <ChevronDown
                            size={15}
                            className={`nav-chevron ${isOpen ? "rotated" : ""}`}
                          />
                        </>
                      )}
                    </button>

                    {isOpen && !collapsed && (
                      <div className="submenu">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;

                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              end
                              onClick={closeMobile}
                              className={({ isActive }) =>
                                `nav-item submenu-item ${
                                  isActive ? "active" : ""
                                }`
                              }
                            >
                              <ChildIcon size={17} />
                              <span>{child.label}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={closeMobile}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} />

                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <span className="sidebar-version">
            {collapsed ? "v1.0" : "Lead Manager v1.0.0"}
          </span>
        </div>
      </aside>
    </>
  );
}
