import {
  Users,
  UserPlus,
  PhoneCall,
  BadgeCheck,
  CalendarDays,
  CalendarClock,
  AlertCircle,
  UserRoundX,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import StatCard from "../common/StatCard";

import "./DashboardStats.css";

export default function DashboardStats({ stats }) {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      color: "blue",
      description: "All registered leads",
      path: "/leads",
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      icon: UserPlus,
      color: "green",
      description: "Newly added leads",
      path: "/leads?status=new",
    },
    {
      title: "Contacted Leads",
      value: stats.contactedLeads,
      icon: PhoneCall,
      color: "purple",
      description: "Leads contacted",
      path: "/leads?status=contacted",
    },
    {
      title: "Conversions",
      value: stats.conversions,
      icon: BadgeCheck,
      color: "teal",
      description: "Successfully converted",
      path: "/leads?status=converted",
    },
    {
      title: "Today's Follow-ups",
      value: stats.todayFollowUps,
      icon: CalendarDays,
      color: "blue",
      description: "Scheduled for today",
      path: "/follow-ups?filter=today",
    },
    {
      title: "Upcoming Follow-ups",
      value: stats.upcomingFollowUps,
      icon: CalendarClock,
      color: "purple",
      description: "Scheduled for later",
      path: "/follow-ups?filter=upcoming",
    },
    {
      title: "Overdue Follow-ups",
      value: stats.overdueFollowUps,
      icon: AlertCircle,
      color: "red",
      description: "Require attention",
      path: "/follow-ups?filter=overdue",
    },
    {
      title: "Unassigned Leads",
      value: stats.unassignedLeads,
      icon: UserRoundX,
      color: "orange",
      description: "Waiting for assignment",
      path: "/leads?assigned=false",
    },
  ];

  return (
    <div className="dashboard-stats-grid">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          description={card.description}
          onClick={() => navigate(card.path)}
        />
      ))}
    </div>
  );
}
