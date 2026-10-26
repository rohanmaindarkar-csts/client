// import { ClipboardList } from "lucide-react";
// import PageHeader from "../components/common/PageHeader";
// import "./Assignments.css";

// export default function Assignments() {
//   return (
//     <div className="assignments-page">
//       <PageHeader
//         title="Lead Assignments"
//         description="Manage lead assignments and team responsibilities."
//       />

//       <div className="assignments-content">
//         <ClipboardList size={36} strokeWidth={1.5} />
//         <h3>Lead Assignments</h3>
//         <p>Assigned and unassigned leads will appear here.</p>
//       </div>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import {
  Users,
  Search,
  UserRoundPlus,
  Check,
  ArrowRightLeft,
  X,
} from "lucide-react";
import {
  leads as seedLeads,
  staff as seedStaff,
  getStaffName,
} from "../../data/crmDummyData";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import "./Assignments.css";
export default function Assignments() {
  const [leads, setLeads] = useState(seedLeads);
  const [staff] = useState(seedStaff);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [target, setTarget] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [individual, setIndividual] = useState(null);
  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        const match = [l.businessName, l.ownerName, l.mobileNo].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(search.toLowerCase()),
        );
        return (
          match &&
          (filter === "all" ||
            (filter === "unassigned" ? !l.assignedTo : l.assignedTo === filter))
        );
      }),
    [leads, search, filter],
  );
  const allSelected =
    filtered.length > 0 && filtered.every((l) => selected.includes(l.id));
  const toggleAll = () =>
    setSelected((prev) =>
      allSelected
        ? prev.filter((id) => !filtered.some((l) => l.id === id))
        : [...new Set([...prev, ...filtered.map((l) => l.id)])],
    );
  const applyAssignment = () => {
    if (!target) {
      setMessage("Please choose a staff member.");
      return;
    }
    const ids = individual ? [individual.id] : selected;
    if (!ids.length) {
      setMessage("Select at least one lead.");
      return;
    }
    setLeads((prev) =>
      prev.map((l) => (ids.includes(l.id) ? { ...l, assignedTo: target } : l)),
    );
    setMessage(
      `${ids.length} lead(s) assigned to ${getStaffName(target)} (demo only).`,
    );
    setSelected([]);
    setTarget("");
    setReason("");
    setIndividual(null);
  };
  return (
    <div className="crm-page assignments-page">
      <PageHeader
        title="Lead Assignments"
        description="Assign, reassign and distribute leads across your sales team."
      />
      <div className="crm-stats four">
        <div className="crm-stat">
          <span>Total Leads</span>
          <strong>{leads.length}</strong>
          <small>All leads</small>
        </div>
        <div className="crm-stat">
          <span>Assigned</span>
          <strong>{leads.filter((l) => l.assignedTo).length}</strong>
          <small>With an owner</small>
        </div>
        <div className="crm-stat">
          <span>Unassigned</span>
          <strong>{leads.filter((l) => !l.assignedTo).length}</strong>
          <small>Need assignment</small>
        </div>
        <div className="crm-stat">
          <span>Active Staff</span>
          <strong>{staff.length}</strong>
          <small>Available team members</small>
        </div>
      </div>
      <div className="crm-columns assignment">
        <section className="crm-panel">
          <div className="crm-panel-head">
            <div>
              <h2>Lead Assignment Queue</h2>
              <p>Select one or more leads to assign in bulk.</p>
            </div>
            <span className="crm-badge gold">{selected.length} selected</span>
          </div>
          <div className="crm-toolbar">
            <label className="crm-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search business, owner, mobile..."
              />
            </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All assignments</option>
              <option value="unassigned">Unassigned only</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all visible leads"
                    />
                  </th>
                  <th>Business</th>
                  <th>Priority</th>
                  <th>Current Staff</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(l.id)}
                        onChange={() =>
                          setSelected((prev) =>
                            prev.includes(l.id)
                              ? prev.filter((x) => x !== l.id)
                              : [...prev, l.id],
                          )
                        }
                      />
                    </td>
                    <td>
                      <b>{l.businessName}</b>
                      <small>
                        {l.ownerName} · {l.mobileNo}
                      </small>
                    </td>
                    <td>
                      <span
                        className={"crm-badge " + l.leadPriority.toLowerCase()}
                      >
                        {l.leadPriority}
                      </span>
                    </td>
                    <td>{getStaffName(l.assignedTo)}</td>
                    <td>
                      <button
                        className="crm-icon-btn"
                        title="Assign or reassign"
                        onClick={() => {
                          setIndividual(l);
                          setTarget(l.assignedTo || "");
                          setMessage("");
                        }}
                      >
                        <ArrowRightLeft size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan="5" className="crm-empty">
                      No matching leads.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <aside className="crm-stack">
          <section className="crm-panel">
            <h2 className="crm-section-heading">
              <UserRoundPlus size={17} />
              {individual ? "Reassign Lead" : "Bulk Assignment"}
            </h2>
            {individual ? (
              <div className="crm-selected-lead">
                <b>{individual.businessName}</b>
                <small>Currently: {getStaffName(individual.assignedTo)}</small>
                <button
                  onClick={() => {
                    setIndividual(null);
                    setTarget("");
                  }}
                  aria-label="Cancel individual assignment"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <p className="crm-muted">
                {selected.length} lead(s) selected from the table.
              </p>
            )}
            <label className="crm-field">
              Assign to staff
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="">Select staff member</option>
                {staff.map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.name} · {s.role}
                  </option>
                ))}
              </select>
            </label>
            <label className="crm-field">
              Assignment note (optional)
              <textarea
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for assignment or reassignment"
              />
            </label>
            <div className="assignment-submit">
              <Button variant="primary" onClick={applyAssignment}>
                <Check size={15} />
                {individual
                  ? "Confirm Reassignment"
                  : `Assign ${selected.length} Lead(s)`}
              </Button>
            </div>
            {message && (
              <p className="crm-inline-message" role="status">
                {message}
              </p>
            )}
          </section>
          <section className="crm-panel">
            <h2 className="crm-section-heading">
              <Users size={17} /> Team Workload
            </h2>
            {staff.map((s) => (
              <div className="crm-staff-row" key={s.id}>
                <span className="crm-avatar">{s.initials}</span>
                <div>
                  <b>{s.name}</b>
                  <small>{s.role}</small>
                </div>
                <strong>
                  {leads.filter((l) => l.assignedTo === s.id).length} leads
                </strong>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}
