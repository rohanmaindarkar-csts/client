import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
  Users,
  ClipboardCheck,
  AlertCircle,
  CalendarClock,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import LeadStatusDialog from "../../components/crm/LeadStatusDialog";

import {
  demoFollowUps,
  demoLeads,
  demoStaff,
  effectiveStatus,
  localDateKey,
  toDateTimeLocal,
} from "../../data/crmDummyData";

import "./FollowUps.css";

const initialForm = {
  leadId: "",
  staffId: "",
  type: "Call",
  scheduledAt: "",
  remarks: "",
  nextScheduledAt: "",
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const parseDate = (value) => new Date(`${value}T00:00:00`);

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const formatHeadingDate = (value) =>
  parseDate(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function FollowUps() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const today = localDateKey(new Date());
  const initialDate = params.get("date") || today;

  const [followUps, setFollowUps] = useState(demoFollowUps);
  const [leads, setLeads] = useState(demoLeads);

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [period, setPeriod] = useState(params.get("date") ? "custom" : "today");

  const [fromDate, setFromDate] = useState(params.get("date") || "");
  const [toDate, setToDate] = useState(params.get("date") || "");
  const [search, setSearch] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [modalMode, setModalMode] = useState(null);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [statusDialog, setStatusDialog] = useState(null);

  const getLead = (id) => leads.find((lead) => lead.id === id);
  const getStaff = (id) => demoStaff.find((staff) => staff.id === id);

  const changePeriod = (value) => {
    setPeriod(value);

    if (value === "today") {
      setSelectedDate(today);
      setFromDate(today);
      setToDate(today);
    }

    if (value === "tomorrow") {
      const tomorrow = localDateKey(addDays(new Date(), 1));
      setSelectedDate(tomorrow);
      setFromDate(tomorrow);
      setToDate(tomorrow);
    }
  };

  const inPeriod = (item) => {
    const date = localDateKey(item.scheduledAt);

    if (fromDate && date < fromDate) return false;
    if (toDate && date > toDate) return false;

    return true;
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return followUps
      .filter(inPeriod)
      .filter((item) => !staffFilter || item.staffId === staffFilter)
      .filter((item) => !statusFilter || effectiveStatus(item) === statusFilter)
      .filter((item) => !typeFilter || item.type === typeFilter)
      .filter((item) => {
        const lead = leads.find((l) => l.id === item.leadId);

        return [
          lead?.businessName,
          lead?.ownerName,
          lead?.contactPersonName,
          lead?.mobileNo,
          lead?.id,
          item.remarks,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(term),
        );
      })
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  }, [
    followUps,
    leads,
    period,
    selectedDate,
    fromDate,
    toDate,
    staffFilter,
    statusFilter,
    typeFilter,
    search,
  ]);

  const stats = useMemo(() => {
    const statuses = filtered.map(effectiveStatus);

    return [
      {
        label: "Total",
        value: filtered.length,
        icon: Users,
        color: "blue",
      },
      {
        label: "Completed",
        value: statuses.filter((s) => s === "Completed").length,
        icon: ClipboardCheck,
        color: "green",
      },
      {
        label: "Pending",
        value: statuses.filter((s) => s === "Pending").length,
        icon: Clock3,
        color: "orange",
      },
      {
        label: "Overdue",
        value: statuses.filter((s) => s === "Overdue").length,
        icon: AlertCircle,
        color: "red",
      },
    ];
  }, [filtered]);

  const openCreate = () => {
    setActive(null);
    setForm({
      ...initialForm,
      scheduledAt: toDateTimeLocal(new Date()),
    });
    setModalMode("create");
  };

  const openAction = (item, mode) => {
    setActive(item);
    setForm({
      leadId: item.leadId,
      staffId: item.staffId,
      type: item.type,
      scheduledAt: toDateTimeLocal(item.scheduledAt),
      remarks: "",
      nextScheduledAt: "",
    });
    setModalMode(mode);
  };

  const saveFollowUp = (event) => {
    event.preventDefault();

    if (!form.remarks.trim()) {
      toast.error("Please enter remarks.");
      return;
    }

    if (modalMode === "create") {
      if (!form.leadId || !form.staffId || !form.scheduledAt) {
        toast.error("Please fill required fields.");
        return;
      }

      setFollowUps((prev) => [
        {
          id: crypto.randomUUID(),
          leadId: form.leadId,
          staffId: form.staffId,
          type: form.type,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          status: "Pending",
          remarks: form.remarks,
        },
        ...prev,
      ]);

      toast.success("Follow-up created (demo).");
    }

    if (active && modalMode === "complete") {
      setFollowUps((prev) => {
        const updated = prev.map((item) =>
          item.id === active.id
            ? {
                ...item,
                status: "Completed",
                completionRemarks: form.remarks,
              }
            : item,
        );

        if (form.nextScheduledAt) {
          updated.unshift({
            id: crypto.randomUUID(),
            leadId: active.leadId,
            staffId: active.staffId,
            type: active.type,
            scheduledAt: new Date(form.nextScheduledAt).toISOString(),
            status: "Pending",
            remarks: `Next follow-up: ${form.remarks}`,
          });
        }

        return updated;
      });

      toast.success("Follow-up completed (demo).");
    }

    if (active && modalMode === "reschedule") {
      const date = new Date(form.scheduledAt);

      if (Number.isNaN(date.getTime())) {
        toast.error("Select a valid date and time.");
        return;
      }

      setFollowUps((prev) =>
        prev.map((item) =>
          item.id === active.id
            ? {
                ...item,
                scheduledAt: date.toISOString(),
                status: "Rescheduled",
                remarks: form.remarks,
              }
            : item,
        ),
      );

      toast.success("Follow-up rescheduled (demo).");
    }

    if (active && modalMode === "cancel") {
      setFollowUps((prev) =>
        prev.map((item) =>
          item.id === active.id
            ? {
                ...item,
                status: "Cancelled",
                cancellationReason: form.remarks,
              }
            : item,
        ),
      );

      toast.success("Follow-up cancelled (demo).");
    }

    setModalMode(null);
    setActive(null);
  };

  const changeLeadStatus = (lead, action, reason) => {
    const nextStatus = action === "Reactivated" ? "Contacted" : action;

    setLeads((prev) =>
      prev.map((item) =>
        item.id === lead.id ? { ...item, status: nextStatus } : item,
      ),
    );

    toast.success(`Lead status updated to ${nextStatus} (demo).`);
  };

  const resetFilters = () => {
    setSearch("");
    setStaffFilter("");
    setStatusFilter("");
    setTypeFilter("");
    setFromDate("");
    setToDate("");
    setParams({});
  };

  return (
    <div className="followups-page">
      <PageHeader
        title="Follow-up Management"
        description="Manage scheduled, upcoming and overdue follow-ups."
      >
        <Button
          variant="outlined"
          icon={CalendarDays}
          onClick={() => navigate("/follow-ups/calendar")}
        >
          Calendar View
        </Button>

        <Button variant="primary" icon={Plus} onClick={openCreate}>
          New Follow-up
        </Button>
      </PageHeader>

      <section className="fu-panel">
        <div className="fu-stats">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div className="fu-stat" key={label}>
              <div className={`fu-stat-icon ${color}`}>
                <Icon size={21} />
              </div>

              <div>
                <span>{label}</span>
                <strong>{String(value).padStart(2, "0")}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="fu-periods">
          {[
            ["today", "Today"],
            ["tomorrow", "Tomorrow"],
            ["thisWeek", "This Week"],
            ["nextWeek", "Next Week"],
            ["custom", "Custom Date"],
            ["all", "All"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={period === value ? "active" : ""}
              onClick={() => changePeriod(value)}
            >
              {label}
            </button>
          ))}
        </div> */}

        {/* Filter Card */}
        <div className="fu-filter-card">
          <div className="fu-filters">
            {/* Search */}
            <div className="fu-filter-search">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search name, mobile, business..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Staff */}
            <div className="fu-filter-field fu-staff-field">
              <label>Staff</label>
              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
              >
                <option value="">All Staff</option>
                {demoStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="fu-filter-field fu-status-field">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                {[
                  "Pending",
                  "Completed",
                  "Overdue",
                  "Rescheduled",
                  "Cancelled",
                ].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="fu-filter-field fu-type-field">
              <label>Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Type</option>
                {["Call", "Meeting", "Email", "WhatsApp", "Visit"].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* From */}
            <div className="fu-filter-field fu-date-field">
              <label htmlFor="fu-from-date">From</label>
              <input
                id="fu-from-date"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => {
                  const value = e.target.value;
                  setFromDate(value);

                  if (toDate && value && value > toDate) {
                    setToDate(value);
                  }
                }}
              />
            </div>

            {/* To */}
            <div className="fu-filter-field fu-date-field">
              <label htmlFor="fu-to-date">To</label>
              <input
                id="fu-to-date"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Reset */}
            <button
              type="button"
              className="fu-filter-reset"
              onClick={resetFilters}
            >
              Reset
            </button>

            {/* Right Side Count */}
            <div className="fu-filter-count">
              {filtered.length} of {followUps.length} follow-up(s)
            </div>
          </div>
        </div>

        <div className="fu-table-scroll">
          <table className="fu-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Lead ID</th>
                <th>Business Name</th>
                <th>Contact Person</th>
                <th>Type</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => {
                const lead = getLead(item.leadId);
                const status = effectiveStatus(item);

                return (
                  <tr key={item.id}>
                    <td>{formatTime(item.scheduledAt)}</td>
                    <td className="fu-lead-id">
                      {lead?.leadNumber || item.leadId}
                    </td>
                    <td>
                      <strong>{lead?.businessName || "—"}</strong>
                    </td>
                    <td>{lead?.contactPersonName || lead?.ownerName || "—"}</td>
                    <td>{item.type}</td>
                    <td>
                      <span className={`fu-status fu-${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>
                    <td>{getStaff(item.staffId)?.name || "Unassigned"}</td>
                    <td>
                      <div className="fu-row-actions">
                        <Button
                          variant="ghost"
                          icon={Eye}
                          title="View follow-up"
                          onClick={() => openAction(item, "view")}
                        />

                        {!["Completed", "Cancelled"].includes(item.status) && (
                          <>
                            <Button
                              variant="ghost"
                              icon={CheckCircle2}
                              title="Complete"
                              onClick={() => openAction(item, "complete")}
                            />
                            <Button
                              variant="ghost"
                              icon={Clock3}
                              title="Reschedule"
                              onClick={() => openAction(item, "reschedule")}
                            />
                            <Button
                              variant="ghost"
                              icon={XCircle}
                              title="Cancel"
                              onClick={() => openAction(item, "cancel")}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!filtered.length && (
                <tr>
                  <td colSpan={8} className="fu-empty">
                    No follow-ups found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        isOpen={Boolean(modalMode)}
        onClose={() => setModalMode(null)}
        title={
          {
            create: "Create Follow-up",
            view: "Follow-up Details",
            complete: "Complete Follow-up",
            reschedule: "Reschedule Follow-up",
            cancel: "Cancel Follow-up",
          }[modalMode] || ""
        }
        size="md"
      >
        {modalMode === "view" && active ? (
          <div className="fu-details">
            <p>
              <b>Business:</b> {getLead(active.leadId)?.businessName || "—"}
            </p>
            <p>
              <b>Contact:</b> {getLead(active.leadId)?.ownerName || "—"}
            </p>
            <p>
              <b>Staff:</b> {getStaff(active.staffId)?.name || "Unassigned"}
            </p>
            <p>
              <b>Type:</b> {active.type}
            </p>
            <p>
              <b>Scheduled:</b>{" "}
              {new Date(active.scheduledAt).toLocaleString("en-IN")}
            </p>
            <p>
              <b>Status:</b> {effectiveStatus(active)}
            </p>
            <p>
              <b>Remarks:</b> {active.remarks || "—"}
            </p>

            {getLead(active.leadId) && (
              <div className="fu-form-actions">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      setStatusDialog({
                        lead: getLead(active.leadId),
                        action: e.target.value,
                      });
                      setModalMode(null);
                    }
                  }}
                >
                  <option value="">Change Lead Status</option>
                  <option value="Converted">Convert</option>
                  <option value="Lost">Mark Lost</option>
                  <option value="Reactivated">Reactivate</option>
                </select>
              </div>
            )}
          </div>
        ) : (
          <form className="fu-form" onSubmit={saveFollowUp}>
            {modalMode === "create" && (
              <>
                <label>Lead *</label>
                <select
                  required
                  value={form.leadId}
                  onChange={(e) => setForm({ ...form, leadId: e.target.value })}
                >
                  <option value="">Select Lead</option>
                  {leads
                    .filter(
                      (lead) => !["Lost", "Converted"].includes(lead.status),
                    )
                    .map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.businessName}
                      </option>
                    ))}
                </select>

                <label>Assign Staff *</label>
                <select
                  required
                  value={form.staffId}
                  onChange={(e) =>
                    setForm({ ...form, staffId: e.target.value })
                  }
                >
                  <option value="">Select Staff</option>
                  {demoStaff.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}
                    </option>
                  ))}
                </select>

                <label>Communication Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {["Call", "Meeting", "Email", "WhatsApp", "Visit"].map(
                    (type) => (
                      <option key={type}>{type}</option>
                    ),
                  )}
                </select>
              </>
            )}

            {["create", "reschedule"].includes(modalMode) && (
              <>
                <label>
                  {modalMode === "reschedule"
                    ? "New Date & Time"
                    : "Schedule Date & Time"}{" "}
                  *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.scheduledAt}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      scheduledAt: e.target.value,
                    })
                  }
                />
              </>
            )}

            <label>
              {modalMode === "cancel" ? "Cancellation Reason" : "Remarks"} *
            </label>
            <textarea
              rows={3}
              required
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              placeholder="Enter details..."
            />

            {modalMode === "complete" && (
              <>
                <label>Next Follow-up (Optional)</label>
                <input
                  type="datetime-local"
                  value={form.nextScheduledAt}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nextScheduledAt: e.target.value,
                    })
                  }
                />
              </>
            )}

            <div className="fu-form-actions">
              <Button variant="secondary" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <LeadStatusDialog
        lead={statusDialog?.lead}
        action={statusDialog?.action}
        onClose={() => setStatusDialog(null)}
        onConfirm={changeLeadStatus}
      />
    </div>
  );
}
