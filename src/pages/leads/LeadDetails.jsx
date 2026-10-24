import { useState } from "react";
import {
  Building2,
  UserRound,
  MapPin,
  ClipboardList,
  CalendarDays,
  Paperclip,
  FileText,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";

import Modal from "../../components/common/Modal";
import "./LeadDetails.css";

const FILE_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/api\/?$/,
  "",
);

const fileUrl = (path) => {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) return path;

  return `${FILE_BASE_URL}/${String(path).replace(/^\/+/, "")}`;
};

const fileName = (path) =>
  decodeURIComponent(
    String(path || "")
      .split("?")[0]
      .split("/")
      .pop() || "File",
  );

const isImage = (path) =>
  /\.(jpg|jpeg|png|jfif|webp|gif|bmp)(\?.*)?$/i.test(path);

const isPdf = (path) => /\.pdf(\?.*)?$/i.test(path);

const formatDate = (value, showTime = false) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(showTime ? { hour: "2-digit", minute: "2-digit", hour12: true } : {}),
  });
};

const showValue = (value) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

const money = (value) => {
  if (value === "" || value == null) return "—";

  const amount = Number(value);

  return Number.isFinite(amount)
    ? `₹${amount.toLocaleString("en-IN")}`
    : String(value);
};

const staffName = (staff) => {
  if (!staff) return "Unassigned";

  if (typeof staff === "object") {
    return staff.name || staff.fullName || "Unassigned";
  }

  return "Unassigned";
};

function Detail({ label, value }) {
  return (
    <div className="lead-detail-item">
      <span>{label}</span>
      <strong>{showValue(value)}</strong>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="lead-details-section">
      <div className="lead-details-heading">
        <Icon size={16} />
        <h3>{title}</h3>
      </div>

      <div className="lead-details-grid">{children}</div>
    </section>
  );
}

export default function LeadDetails({ lead }) {
  const [preview, setPreview] = useState(null);

  if (!lead) return null;

  const attachments = Array.isArray(lead.attachedFiles)
    ? lead.attachedFiles
    : [];

  return (
    <div className="lead-details">
      <Section title="Business Information" icon={Building2}>
        <Detail label="Business Name" value={lead.businessName} />
        <Detail label="Business Type" value={lead.businessType} />
        <Detail label="Number of Branches" value={lead.noOfBranch} />
      </Section>

      <Section title="Contact Information" icon={UserRound}>
        <Detail label="Owner Name" value={lead.ownerName} />
        <Detail label="Contact Person" value={lead.contactPersonName} />
        <Detail label="Mobile Number" value={lead.mobileNo} />
        <Detail label="Alternate Mobile" value={lead.alternateMobileNo} />
        <Detail label="Email" value={lead.email} />
      </Section>

      <Section title="Business Address" icon={MapPin}>
        <Detail label="Address" value={lead.address} />
        <Detail label="City" value={lead.city} />
        <Detail label="State" value={lead.state} />
        <Detail label="Pincode" value={lead.pincode} />
      </Section>

      <Section title="Lead Information" icon={ClipboardList}>
        <Detail label="Lead Source" value={lead.leadSource} />
        <Detail label="Campaign Name" value={lead.campaignName} />
        <Detail label="Interested Plan" value={lead.interestedPlan} />
        <Detail label="Assigned Staff" value={staffName(lead.assignStaff)} />
        <Detail label="Lead Priority" value={lead.leadPriority} />
        <Detail label="Estimated Value" value={money(lead.estimatedValue)} />
      </Section>

      <Section title="Follow-up & Dates" icon={CalendarDays}>
        <Detail
          label="Expected Purchase"
          value={formatDate(lead.expectedPurchaseDate)}
        />
        <Detail
          label="Next Follow-up"
          value={formatDate(lead.nextFollowUpDateTime, true)}
        />
        <Detail label="Created At" value={formatDate(lead.createdAt, true)} />
        <Detail label="Updated At" value={formatDate(lead.updatedAt, true)} />
      </Section>

      <section className="lead-details-section">
        <div className="lead-details-heading">
          <ClipboardList size={16} />
          <h3>Remarks</h3>
        </div>

        <p className="lead-details-remarks">
          {lead.remarks || "No remarks available."}
        </p>
      </section>

      <section className="lead-details-section">
        <div className="lead-details-heading">
          <Paperclip size={16} />
          <h3>Attachments ({attachments.length})</h3>
        </div>

        {attachments.length === 0 ? (
          <p className="lead-details-empty">No attachments available.</p>
        ) : (
          <div className="lead-details-files">
            {attachments.map((path, index) => (
              <div className="lead-details-file" key={`${path}-${index}`}>
                <button
                  type="button"
                  className="lead-details-file-thumb"
                  onClick={() => setPreview(path)}
                >
                  {isImage(path) ? (
                    <img src={fileUrl(path)} alt={fileName(path)} />
                  ) : (
                    <FileText size={30} />
                  )}
                  <Eye size={15} className="lead-details-eye" />
                </button>

                <span title={fileName(path)}>{fileName(path)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={Boolean(preview)}
        onClose={() => setPreview(null)}
        title="File Preview"
        subtitle={preview ? fileName(preview) : ""}
        size="lg"
        footer={
          <>
            <a
              href={fileUrl(preview)}
              target="_blank"
              rel="noopener noreferrer"
              className="lead-details-open-file"
            >
              <ExternalLink size={15} />
              Open File
            </a>
            <button
              type="button"
              className="lead-details-close-preview"
              onClick={() => setPreview(null)}
            >
              <X size={15} />
              Close
            </button>
          </>
        }
      >
        <div className="lead-details-preview">
          {preview && isImage(preview) ? (
            <img src={fileUrl(preview)} alt={fileName(preview)} />
          ) : preview && isPdf(preview) ? (
            <iframe src={fileUrl(preview)} title={fileName(preview)} />
          ) : (
            <p>Preview not supported. Use Open File.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
