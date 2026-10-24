import {
  LayoutDashboard,
  Users,
  List,
  UserPlus,
  CalendarClock,
  ClipboardList,
  ScrollText,
  ChartNoAxesCombined,
  Database,
} from "lucide-react";

export const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Lead Management",
    icon: Users,
    children: [
      {
        label: "All Leads",
        icon: List,
        path: "/leads",
      },
      {
        label: "Add New Lead",
        icon: UserPlus,
        path: "/leads/add",
      },
      {
        label: "Follow-ups",
        icon: CalendarClock,
        path: "/follow-ups",
      },
      {
        label: "Assignments",
        icon: ClipboardList,
        path: "/assignments",
      },
    ],
  },
  {
    label: "Audit Logs",
    icon: ScrollText,
    path: "/audit-logs",
  },
  {
    label: "Reports",
    icon: ChartNoAxesCombined,
    path: "/reports",
  },
  {
    label: "Lead Sources",
    icon: Database,
    path: "/lead-sources",
  },
];
