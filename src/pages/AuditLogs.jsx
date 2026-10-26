import { useMemo, useState } from "react";
import { History, Search, RotateCcw, Eye, ArrowRight } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import Modal from "../components/common/Modal";
import Pagination from "../components/common/Pagination";

import {
  demoAuditLogs,
  demoLeads,
  formatDateTime,
  localDateKey,
} from "../data/crmDummyData";

import "./AuditLogs.css";

const PAGE_SIZE = 10;

const actionLabels = {
  STATUS_CHANGED: "Status Changed",
  FOLLOWUP_CREATED: "Follow-up Created",
  FOLLOWUP_COMPLETED: "Follow-up Completed",
  FOLLOWUP_RESCHEDULED: "Follow-up Rescheduled",
  FOLLOWUP_CANCELLED: "Follow-up Cancelled",
  ASSIGNED: "Staff Assigned",
  REASSIGNED: "Staff Reassigned",
  LEAD_CONVERTED: "Lead Converted",
  LEAD_LOST: "Lead Lost",
  LEAD_REACTIVATED: "Lead Reactivated",
};

const initialFilters = {
  search: "",
  actionType: "",
  changedBy: "",
  fromDate: "",
  toDate: "",
};

export default function AuditLogs() {
  const [logs] = useState(demoAuditLogs);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  const leadName = (id) =>
    demoLeads.find((lead) => lead.id === id)?.businessName || "Unknown Lead";

  const actionTypes = useMemo(
    () => [...new Set(logs.map((log) => log.actionType))].sort(),
    [logs],
  );

  const users = useMemo(
    () => [...new Set(logs.map((log) => log.changedBy))].sort(),
    [logs],
  );

  const filteredLogs = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    return logs
      .filter((log) => {
        const lead = demoLeads.find((l) => l.id === log.leadId);

        const searchable = [
          lead?.businessName,
          log.actionType,
          log.changedBy,
          log.field,
          log.previousValue,
          log.newValue,
          log.reason,
        ]
          .join(" ")
          .toLowerCase();

        if (term && !searchable.includes(term)) return false;

        if (filters.actionType && log.actionType !== filters.actionType)
          return false;

        if (filters.changedBy && log.changedBy !== filters.changedBy)
          return false;

        const date = localDateKey(log.timestamp);

        if (filters.fromDate && date < filters.fromDate) return false;
        if (filters.toDate && date > filters.toDate) return false;

        return true;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [logs, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);

  const visibleLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const updateFilter = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPage(1);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  return (
    <div className="audit-logs-page">
      <PageHeader
        title="Audit Logs"
        description="Track lead activities, changes and user actions."
      />

      <div className="audit-summary">
        <div>
          <History size={19} />
          <span>Total Activities</span>
          <strong>{logs.length}</strong>
        </div>
        <div>
          <span>Filtered Results</span>
          <strong>{filteredLogs.length}</strong>
        </div>
        <div>
          <span>Unique Users</span>
          <strong>{users.length}</strong>
        </div>
      </div>

      <div className="audit-panel">
        <div className="audit-panel-heading">
          <h3>Activity History</h3>
          <span>{filteredLogs.length} records</span>
        </div>

        <div className="audit-filters">
          <div className="audit-search">
            <Search size={16} />
            <input
              name="search"
              placeholder="Search lead, field, action..."
              value={filters.search}
              onChange={updateFilter}
            />
          </div>

          <select
            name="actionType"
            value={filters.actionType}
            onChange={updateFilter}
          >
            <option value="">All Actions</option>
            {actionTypes.map((type) => (
              <option key={type} value={type}>
                {actionLabels[type] || type.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <select
            name="changedBy"
            value={filters.changedBy}
            onChange={updateFilter}
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            max={filters.toDate || undefined}
            onChange={updateFilter}
            aria-label="From date"
          />

          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            min={filters.fromDate || undefined}
            onChange={updateFilter}
            aria-label="To date"
          />

          <button className="audit-reset" type="button" onClick={resetFilters}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="audit-table-scroll">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Action Type</th>
                <th>Field Changed</th>
                <th>Previous Value</th>
                <th>New Value</th>
                <th>Changed By</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="audit-empty">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                visibleLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="audit-lead-name">{leadName(log.leadId)}</td>

                    <td>
                      <span className="audit-action-badge">
                        {actionLabels[log.actionType] ||
                          log.actionType.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td>{log.field}</td>

                    <td>
                      <span className="audit-old-value">
                        {log.previousValue || "—"}
                      </span>
                    </td>

                    <td>
                      <span className="audit-new-value">
                        {log.newValue || "—"}
                      </span>
                    </td>

                    <td>{log.changedBy}</td>
                    <td>{formatDateTime(log.timestamp)}</td>

                    <td>
                      <button
                        className="audit-view-btn"
                        type="button"
                        title="View Change"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLogs.length}
            itemsPerPage={PAGE_SIZE}
            itemLabel="activities"
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        title="Activity Details"
        subtitle={selectedLog ? leadName(selectedLog.leadId) : ""}
        size="md"
      >
        {selectedLog && (
          <div className="audit-detail-modal">
            <div className="audit-detail-grid">
              <div>
                <label>Action Type</label>
                <strong>
                  {actionLabels[selectedLog.actionType] ||
                    selectedLog.actionType}
                </strong>
              </div>
              <div>
                <label>Changed By</label>
                <strong>{selectedLog.changedBy}</strong>
              </div>
              <div>
                <label>Field</label>
                <strong>{selectedLog.field}</strong>
              </div>
              <div>
                <label>Timestamp</label>
                <strong>{formatDateTime(selectedLog.timestamp)}</strong>
              </div>
            </div>

            <div className="audit-change-comparison">
              <div>
                <label>Previous Value</label>
                <p>{selectedLog.previousValue || "—"}</p>
              </div>

              <ArrowRight size={18} />

              <div>
                <label>New Value</label>
                <p>{selectedLog.newValue || "—"}</p>
              </div>
            </div>

            <div className="audit-detail-reason">
              <label>Reason / Remarks</label>
              <p>{selectedLog.reason || "No reason provided."}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
