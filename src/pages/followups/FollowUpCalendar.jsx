import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  UserRound,
  Building2,
  Phone,
  MessageSquare,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

import {
  demoFollowUps,
  demoLeads,
  demoStaff,
  effectiveStatus,
  localDateKey,
} from "../../data/crmDummyData";

import "./FollowUpCalendar.css";

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getWeekStart = (date) => {
  const day = (date.getDay() + 6) % 7;
  return addDays(date, -day);
};

const sameDate = (a, b) => localDateKey(a) === localDateKey(b);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const statusColors = [
  "Scheduled",
  "Completed",
  "Pending",
  "Overdue",
  "Rescheduled",
  "Cancelled",
];

export default function FollowUpCalendar() {
  const navigate = useNavigate();
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLead = (id) => demoLeads.find((lead) => lead.id === id);

  const getStaff = (id) => demoStaff.find((staff) => staff.id === id);

  const getItems = (date) => {
    return demoFollowUps
      .filter((item) => sameDate(new Date(item.scheduledAt), date))
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  };

  const calendarDays = useMemo(() => {
    if (view === "day") return [currentDate];

    if (view === "week") {
      const start = getWeekStart(currentDate);

      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [
      ...Array(offset).fill(null),
      ...Array.from(
        { length: daysInMonth },
        (_, i) => new Date(year, month, i + 1),
      ),
    ];

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [currentDate, view]);

  const navigatePeriod = (direction) => {
    if (view === "month") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + direction,
          1,
        ),
      );
    } else {
      setCurrentDate(
        addDays(currentDate, direction * (view === "week" ? 7 : 1)),
      );
    }
  };

  const heading = () => {
    if (view === "month") {
      return currentDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });
    }

    if (view === "week") {
      const start = getWeekStart(currentDate);

      return `${formatDate(start)} - ${formatDate(addDays(start, 6))}`;
    }

    return formatDate(currentDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const selectedItems = selectedDate ? getItems(selectedDate) : [];

  return (
    <div className="followup-calendar-page">
      <PageHeader
        title="Follow-up Calendar"
        description="View scheduled follow-ups by month, week or day."
      >
        <Button
          variant="outlined"
          icon={ArrowLeft}
          onClick={() => navigate("/follow-ups")}
        >
          Back
        </Button>
      </PageHeader>

      <section className="fuc-panel">
        <div className="fuc-toolbar">
          <div className="fuc-navigation">
            <Button
              variant="outlined"
              icon={ChevronLeft}
              onClick={() => navigatePeriod(-1)}
            />

            <h2>{heading()}</h2>

            <Button
              variant="outlined"
              icon={ChevronRight}
              onClick={() => navigatePeriod(1)}
            />

            <Button
              variant="secondary"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>

          <div className="fuc-view-switch">
            {["month", "week", "day"].map((option) => (
              <button
                type="button"
                key={option}
                className={view === option ? "active" : ""}
                onClick={() => setView(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="fuc-scroll">
          <div className={`fuc-grid ${view === "day" ? "fuc-day-view" : ""}`}>
            {view !== "day" &&
              ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div className="fuc-weekday" key={day}>
                  {day}
                </div>
              ))}

            {calendarDays.map((date, index) => {
              if (!date) {
                return <div className="fuc-empty-day" key={`blank-${index}`} />;
              }

              const items = getItems(date);
              const isToday = sameDate(date, new Date());

              return (
                <button
                  type="button"
                  key={localDateKey(date)}
                  className={`fuc-date ${isToday ? "today" : ""}`}
                  onClick={() => handleDateClick(date)}
                >
                  <span className="fuc-date-number">{date.getDate()}</span>

                  {items.length > 0 && (
                    <div className="fuc-events">
                      {Object.entries(
                        items.reduce((acc, item) => {
                          const status = effectiveStatus(item);

                          acc[status] = (acc[status] || 0) + 1;

                          return acc;
                        }, {}),
                      )
                        .slice(0, 3)
                        .map(([status, count]) => (
                          <div className="fuc-event" key={status}>
                            <span
                              className={`fuc-dot ${status.toLowerCase()}`}
                            />

                            <span>
                              {count} {status}
                            </span>
                          </div>
                        ))}

                      <small>{items.length} follow-ups</small>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="fuc-legend">
          {statusColors.map((status) => (
            <span key={status}>
              <i className={`fuc-dot ${status.toLowerCase()}`} />
              {status}
            </span>
          ))}
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
        title={
          selectedDate
            ? `Follow-ups - ${formatDate(selectedDate)}`
            : "Follow-up Details"
        }
        subtitle={`${selectedItems.length} follow-up(s) scheduled`}
        size="lg"
      >
        <div className="fuc-modal-content">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => {
              const lead = getLead(item.leadId);
              const staff = getStaff(item.staffId);
              const status = effectiveStatus(item);

              return (
                <div className="fuc-detail-card" key={item.id}>
                  <div className="fuc-detail-header">
                    <div>
                      <h3>{lead?.businessName || "Unknown Lead"}</h3>

                      <span>Lead ID: {lead?.leadNumber || item.leadId}</span>
                    </div>

                    <span className={`fuc-status ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>

                  <div className="fuc-detail-grid">
                    <div className="fuc-detail-field">
                      <span>
                        <UserRound size={14} />
                        Contact Person
                      </span>

                      <strong>
                        {lead?.contactPersonName || lead?.ownerName || "—"}
                      </strong>
                    </div>

                    <div className="fuc-detail-field">
                      <span>
                        <Phone size={14} />
                        Mobile Number
                      </span>

                      <strong>{lead?.mobileNo || "—"}</strong>
                    </div>

                    <div className="fuc-detail-field">
                      <span>
                        <Clock3 size={14} />
                        Scheduled Time
                      </span>

                      <strong>{formatTime(item.scheduledAt)}</strong>
                    </div>

                    <div className="fuc-detail-field">
                      <span>
                        <CalendarDays size={14} />
                        Follow-up Type
                      </span>

                      <strong>{item.type}</strong>
                    </div>

                    <div className="fuc-detail-field">
                      <span>
                        <Building2 size={14} />
                        Assigned Staff
                      </span>

                      <strong>{staff?.name || "Unassigned"}</strong>
                    </div>
                  </div>

                  <div className="fuc-detail-remarks">
                    <span>
                      <MessageSquare size={14} />
                      Remarks
                    </span>

                    <p>{item.remarks || "No remarks added."}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="fuc-no-data">
              No follow-ups scheduled for this date.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
