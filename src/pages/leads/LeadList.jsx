import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  RotateCcw,
  Eye,
  Pencil,
  AlertCircle,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { getLeads, getLeadById, deleteLead } from "../../api/leadApi";
import Modal from "../../components/common/Modal";
import LeadDetails from "./LeadDetails";
import useDebounce from "../../hooks/useDebounce";
import Pagination from "../../components/common/Pagination";

import "./LeadList.css";

const PAGE_SIZE = 10;

const initialFilters = {
  search: "",
  leadSource: "",
  leadPriority: "",
  businessType: "",
  fromDate: "",
  toDate: "",
};

const leadSources = [
  "Website",
  "Social Media",
  "Reference",
  "Walk-in",
  "Cold Call",
  "Advertisement",
  "Other",
];

const businessTypes = [
  "Retail",
  "Wholesale",
  "Distributor",
  "Manufacturer",
  "Service Provider",
  "Other",
];

const priorities = ["Low", "Medium", "High", "Urgent"];

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function LeadList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchLeads = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          limit: PAGE_SIZE,
        };

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        if (filters.leadSource) {
          params.leadSource = filters.leadSource;
        }

        if (filters.leadPriority) {
          params.leadPriority = filters.leadPriority;
        }

        if (filters.businessType) {
          params.businessType = filters.businessType;
        }

        if (filters.fromDate) {
          params.fromDate = filters.fromDate;
        }

        if (filters.toDate) {
          params.toDate = filters.toDate;
        }

        const response = await getLeads(params);

        if (signal.aborted) return;

        if (response.success === false) {
          throw new Error(response.message || "Failed to fetch leads.");
        }

        setLeads(Array.isArray(response.data) ? response.data : []);
        setPagination(response.pagination || null);
      } catch (err) {
        if (signal.aborted) return;

        setError(
          err.response?.data?.message || err.message || "Unable to load leads.",
        );

        setLeads([]);
        setPagination(null);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [
      page,
      debouncedSearch,
      filters.leadSource,
      filters.leadPriority,
      filters.businessType,
      filters.fromDate,
      filters.toDate,
    ],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchLeads(controller.signal);

    return () => controller.abort();
  }, [fetchLeads, refreshKey]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPage(1);
  };

  const handleReset = () => {
    setFilters({ ...initialFilters });
    setPage(1);
    setRefreshKey((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleView = async (lead) => {
    setSelectedLead(lead);
    setViewError("");
    setViewLoading(true);

    try {
      const response = await getLeadById(lead._id);

      if (response.success === false || !response.data) {
        throw new Error(response.message || "Unable to fetch lead details.");
      }

      setSelectedLead(response.data);
    } catch (err) {
      setViewError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load lead details.",
      );
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    try {
      setDeleting(true);

      const response = await deleteLead(deleteTarget._id);

      if (response.success === false) {
        throw new Error(response.message || "Failed to delete lead.");
      }

      toast.success(response.message || "Lead deleted successfully!");

      setDeleteTarget(null);

      // If the last item on the page was deleted,
      // move to the previous page.
      if (leads.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete lead.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const totalLeads = pagination?.totalLeads ?? leads.length;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const currentPage = pagination?.currentPage ?? page;

  return (
    <div className="lead-list-page">
      <PageHeader
        title="All Leads"
        description="View, search and manage your leads."
      >
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate("/leads/add")}
        >
          Add New Lead
        </Button>
      </PageHeader>

      <div className="lead-list-filters">
        <div className="lead-filter-search">
          <Search size={16} />

          <input
            type="text"
            name="search"
            placeholder="Search business, owner, mobile..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="lead-filter-field">
          <label>Lead Source</label>
          <select
            name="leadSource"
            value={filters.leadSource}
            onChange={handleFilterChange}
          >
            <option value="">All Sources</option>
            {leadSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div className="lead-filter-field">
          <label>Priority</label>
          <select
            name="leadPriority"
            value={filters.leadPriority}
            onChange={handleFilterChange}
          >
            <option value="">All Priorities</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="lead-filter-field">
          <label>Business Type</label>
          <select
            name="businessType"
            value={filters.businessType}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="lead-filter-field">
          <label>From</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            max={filters.toDate || undefined}
            onChange={handleFilterChange}
          />
        </div>

        <div className="lead-filter-field">
          <label>To</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            min={filters.fromDate || undefined}
            onChange={handleFilterChange}
          />
        </div>

        <div className="lead-filter-actions">
          <button
            type="button"
            className="lead-filter-reset"
            onClick={handleReset}
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            type="button"
            className="lead-filter-refresh"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="lead-list-content">
        <div className="lead-list-table-header">
          <h3>Lead Records</h3>
          <span>{totalLeads} lead(s)</span>
        </div>

        <div className="lead-table-scroll">
          <table className="lead-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Owner</th>
                <th>Mobile</th>
                <th>Business Type</th>
                <th>Lead Source</th>
                <th>Interested Plan</th>
                <th>Priority</th>
                <th>Assigned Staff</th>
                <th>Created</th>
                <th className="lead-actions-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="lead-table-message">
                    <RefreshCw size={20} className="spin" />
                    Loading leads...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="lead-table-message lead-error">
                    <AlertCircle size={20} />
                    {error}
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="lead-table-message">
                    <Users size={24} />
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <span className="lead-business-name">
                        {lead.businessName || "—"}
                      </span>
                    </td>

                    <td>{lead.ownerName || "—"}</td>
                    <td>{lead.mobileNo || "—"}</td>
                    <td>{lead.businessType || "—"}</td>
                    <td>{lead.leadSource || "—"}</td>
                    <td>{lead.interestedPlan || "—"}</td>

                    <td>
                      <span
                        className={`lead-priority-badge ${
                          lead.leadPriority || "Medium"
                        }`.toLowerCase()}
                      >
                        {lead.leadPriority || "Medium"}
                      </span>
                    </td>

                    <td>
                      {typeof lead.assignStaff === "object" &&
                      lead.assignStaff !== null
                        ? lead.assignStaff.name || "—"
                        : "Unassigned"}
                    </td>

                    <td>{formatDate(lead.createdAt)}</td>

                    <td className="lead-actions-column">
                      <div className="lead-row-actions">
                        <button
                          type="button"
                          title="View Lead"
                          aria-label={`View ${lead.businessName}`}
                          onClick={() => handleView(lead)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Edit Lead"
                          aria-label={`Edit ${lead.businessName}`}
                          onClick={() => navigate(`/leads/edit/${lead._id}`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete Lead"
                          aria-label={`Delete ${lead.businessName}`}
                          className="lead-delete-action"
                          onClick={() => setDeleteTarget(lead)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && totalLeads > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalLeads}
            itemsPerPage={PAGE_SIZE}
            itemLabel="leads"
            onPageChange={setPage}
          />
        )}
        <Modal
          isOpen={Boolean(selectedLead)}
          onClose={() => {
            setSelectedLead(null);
            setViewError("");
          }}
          title="Lead Details"
          subtitle={selectedLead?.businessName}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedLead(null)}>
                Close
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  navigate(`/leads/edit/${selectedLead._id}`);
                  setSelectedLead(null);
                }}
              >
                Edit Lead
              </Button>
            </>
          }
        >
          {viewLoading ? (
            <div className="lead-modal-state">
              <RefreshCw size={20} className="spin" />
              Loading lead details...
            </div>
          ) : viewError ? (
            <div className="lead-modal-state lead-error">
              <AlertCircle size={20} />
              {viewError}
            </div>
          ) : (
            <LeadDetails lead={selectedLead} />
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={Boolean(deleteTarget)}
          onClose={() => {
            if (!deleting) setDeleteTarget(null);
          }}
          title="Delete Lead"
          subtitle="Confirm lead deletion"
          size="sm"
          closeOnOverlay={!deleting}
          footer={
            <>
              <Button
                variant="secondary"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? "Deleting..." : "Delete Lead"}
              </Button>
            </>
          }
        >
          <div className="lead-delete-confirmation">
            <div className="lead-delete-icon">
              <Trash2 size={22} />
            </div>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.businessName}</strong>?
            </p>

            <span>This action cannot be undone.</span>
          </div>
        </Modal>
      </div>
    </div>
  );
}
