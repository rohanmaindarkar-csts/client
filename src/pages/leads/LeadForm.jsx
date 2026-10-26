import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  ClipboardList,
  MapPin,
  FilePlus2,
  FileText,
  Image,
  X,
  Eye,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import FormField from "../../components/common/FormField";
import {
  getLeadById,
  createLead,
  updateLead,
  getPincodeDetails,
} from "../../api/leadApi";
import {
  initialLeadForm,
  businessTypes,
  leadSources,
  leadPriorities,
  leadStatuses,
} from "../../config/leadFormConfig";

import "./LeadForm.css";
import { toast } from "react-toastify";
const toDateInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const toDateTimeInput = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return local.toISOString().slice(0, 16);
};

const normalizeLead = (lead) => ({
  ...initialLeadForm,
  ...lead,
  assignStaff:
    typeof lead.assignStaff === "object"
      ? lead.assignStaff?._id || ""
      : lead.assignStaff || "",
  expectedPurchaseDate: toDateInput(lead.expectedPurchaseDate),
  nextFollowUpDateTime: toDateTimeInput(lead.nextFollowUpDateTime),
  attachedFiles: Array.isArray(lead.attachedFiles) ? lead.attachedFiles : [],
});

const extractPincodeLocation = (payload) => {
  const raw = payload?.data ?? payload;

  const item = Array.isArray(raw)
    ? raw[0]
    : (raw?.postOffice?.[0] ??
      raw?.postOffices?.[0] ??
      raw?.PostOffice?.[0] ??
      raw);

  return {
    city: item?.city ?? item?.district ?? item?.District ?? "",
    state: item?.state ?? item?.State ?? "",
  };
};

export default function LeadForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    ...initialLeadForm,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (event) => {
    const incomingFiles = Array.from(event.target.files || []);

    setFileError("");

    const totalFiles = selectedFiles.length + incomingFiles.length;

    if (totalFiles > MAX_FILES) {
      setFileError("You can attach a maximum of 5 files.");
      event.target.value = "";
      return;
    }

    const oversizedFile = incomingFiles.find(
      (file) => file.size > MAX_FILE_SIZE,
    );

    if (oversizedFile) {
      setFileError(`${oversizedFile.name} exceeds the 5 MB file size limit.`);
      event.target.value = "";
      return;
    }

    const newFiles = incomingFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    event.target.value = "";
  };

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => {
      const item = prev.find((entry) => entry.id === fileId);

      if (item) {
        URL.revokeObjectURL(item.url);
      }

      return prev.filter((entry) => entry.id !== fileId);
    });

    if (previewFile?.id === fileId) {
      setPreviewFile(null);
    }

    setFileError("");
  };

  const formatFileSize = (bytes) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Staff API is not supplied yet.
  // Replace this with real staff records once available.
  const staffOptions = [];

  useEffect(() => {
    if (!isEditMode) return;

    let active = true;

    const fetchLead = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await getLeadById(id);

        // Extract lead data from API response
        const lead = response.data;

        if (!lead || Array.isArray(lead) || typeof lead !== "object") {
          throw new Error("Invalid lead details response.");
        }

        if (active) {
          setFormData(normalizeLead(lead));
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch lead details.",
          );
        }
      } finally {
        if (active) {
          setFetching(false);
        }
      }
    };

    fetchLead();

    return () => {
      active = false;
    };
  }, [id, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let updatedValue = value;

    // Mobile and Alternate Mobile: only 10 digits
    if (name === "mobileNo" || name === "alternateMobileNo") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Pincode: only 6 digits
    if (name === "pincode") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,

      // Clear city and state when pincode is incomplete
      ...(name === "pincode" && updatedValue.length !== 6
        ? { city: "", state: "" }
        : {}),
    }));

    // Clear field validation error
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Clear pincode message
    if (name === "pincode") {
      setPincodeMessage("");
    }
  };

  // Lookup city and state after a valid 6-digit pincode.
  useEffect(() => {
    const pincode = formData.pincode;

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPincodeLoading(false);
      return;
    }

    let active = true;

    const timer = setTimeout(async () => {
      try {
        setPincodeLoading(true);
        setPincodeMessage("");

        const response = await getPincodeDetails(pincode);
        const location = extractPincodeLocation(response);
        if (!active) return;

        if (!location.city || !location.state) {
          setPincodeMessage("City and state not found. Please enter manually.");
          return;
        }

        setFormData((prev) => {
          if (prev.pincode !== pincode) return prev;

          return {
            ...prev,
            city: location.city,
            state: location.state,
          };
        });
      } catch {
        if (active) {
          setPincodeMessage(
            "Pincode lookup failed. Enter city and state manually.",
          );
        }
      } finally {
        if (active) setPincodeLoading(false);
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formData.pincode]);

  const validateForm = () => {
    const errors = {};

    const requiredFields = {
      businessName: "Business name",
      ownerName: "Owner name",
      mobileNo: "Mobile number",
      businessType: "Business type",
      address: "Address",
      leadSource: "Lead source",
      interestedPlan: "Interested plan",
    };

    Object.entries(requiredFields).forEach(([key, label]) => {
      if (!String(formData[key] ?? "").trim()) {
        errors[key] = `${label} is required.`;
      }
    });

    if (formData.mobileNo && !/^[6-9][0-9]{9}$/.test(formData.mobileNo)) {
      errors.mobileNo = "Enter a valid 10-digit mobile number.";
    }

    if (
      formData.alternateMobileNo &&
      !/^[6-9][0-9]{9}$/.test(formData.alternateMobileNo)
    ) {
      errors.alternateMobileNo = "Enter a valid 10-digit mobile number.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      errors.pincode = "Enter a valid 6-digit pincode.";
    }

    if (
      !Number.isInteger(Number(formData.noOfBranch)) ||
      Number(formData.noOfBranch) < 1
    ) {
      errors.noOfBranch = "Branches must be at least 1.";
    }

    if (
      formData.estimatedValue &&
      (!/^\d+(\.\d+)?$/.test(formData.estimatedValue) ||
        Number(formData.estimatedValue) < 0)
    ) {
      errors.estimatedValue = "Enter a valid amount.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setError("Please correct the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        businessName: formData.businessName.trim(),
        ownerName: formData.ownerName.trim(),
        contactPersonName: formData.contactPersonName.trim(),
        mobileNo: formData.mobileNo.trim(),
        alternateMobileNo: formData.alternateMobileNo.trim(),
        email: formData.email.trim().toLowerCase(),
        businessType: formData.businessType,
        noOfBranch: Number(formData.noOfBranch),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),

        leadSource: formData.leadSource,
        campaignName: formData.campaignName.trim(),
        interestedPlan: formData.interestedPlan.trim(),
        assignStaff: formData.assignStaff || null,
        leadPriority: formData.leadPriority,
        leadStatus: formData.leadStatus || "New",
        expectedPurchaseDate: formData.expectedPurchaseDate || null,
        estimatedValue: formData.estimatedValue.trim(),
        remarks: formData.remarks.trim(),
        nextFollowUpDateTime: formData.nextFollowUpDateTime
          ? new Date(formData.nextFollowUpDateTime).toISOString()
          : null,
        attachedFiles: formData.attachedFiles,
      };

      const multipartData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "attachedFiles") return;

        if (value === null || value === undefined) {
          return;
        }

        multipartData.append(key, value);
      });

      selectedFiles.forEach((item) => {
        multipartData.append("attachedFiles", item.file);
      });

      if (isEditMode) {
        const response = await updateLead(id, payload);

        if (response.success === false) {
          throw new Error(response.message || "Failed to update lead.");
        }

        toast.success(response.message || "Lead updated successfully!");
      } else {
        const response = await createLead(multipartData);

        if (response.success === false) {
          throw new Error(response.message || "Failed to create lead.");
        }

        toast.success(response.message || "Lead created successfully!");
      }

      navigate("/leads");
      navigate("/leads", {
        state: {
          successMessage: isEditMode
            ? "Lead updated successfully."
            : "Lead created successfully.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save lead. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, extra = {}) => (
    <FormField
      name={name}
      label={label}
      value={formData[name]}
      onChange={handleChange}
      error={fieldErrors[name]}
      {...extra}
    />
  );

  return (
    <div className="lead-form-page">
      <PageHeader
        title={isEditMode ? "Edit Lead" : "Add New Lead"}
        description={
          isEditMode
            ? "Update existing lead information."
            : "Enter details to create a new lead."
        }
      >
        <Button
          variant="outlined"
          icon={ArrowLeft}
          onClick={() => navigate("/leads")}
        >
          Back to Leads
        </Button>
      </PageHeader>

      {fetching ? (
        <div className="lead-form-container lead-form-loading">
          Loading lead details...
        </div>
      ) : (
        <form
          className="lead-form-container"
          onSubmit={handleSubmit}
          noValidate
        >
          {error && (
            <div className="lead-form-alert" role="alert">
              {error}
            </div>
          )}

          <div className="lead-form-columns">
            {/* LEFT COLUMN */}
            <section className="lead-form-section">
              <div className="lead-form-section-title">
                <Building2 size={16} />
                <h3>Business Information</h3>
              </div>

              <div className="lead-form-grid">
                {field("businessName", "Business Name", {
                  required: true,
                  placeholder: "Enter business name",
                })}

                {field("ownerName", "Owner Name", {
                  required: true,
                  placeholder: "Enter owner name",
                })}

                {field("contactPersonName", "Contact Person Name", {
                  placeholder: "Enter contact person",
                })}

                {field("mobileNo", "Mobile Number", {
                  required: true,
                  type: "tel",
                  inputMode: "numeric",
                  maxLength: 10,
                  pattern: "[0-9]{10}",
                  placeholder: "Enter 10-digit mobile number",
                })}

                {field("alternateMobileNo", "Alternate Mobile Number", {
                  type: "tel",
                  inputMode: "numeric",
                  maxLength: 10,
                  pattern: "[0-9]{10}",
                  placeholder: "Enter alternate mobile number",
                })}

                {field("email", "Email Address", {
                  type: "email",
                  placeholder: "example@company.com",
                })}

                {field("businessType", "Business Type", {
                  type: "select",
                  options: businessTypes,
                  required: true,
                })}

                {field("noOfBranch", "Number of Branches", {
                  type: "number",
                  min: 1,
                  step: 1,
                })}
              </div>

              <div className="lead-form-subsection">
                <div className="lead-form-section-title">
                  <MapPin size={15} />
                  <h3>Business Address</h3>
                </div>

                <div className="lead-form-grid">
                  <div className="lead-form-full">
                    {field("address", "Street Address", {
                      required: true,
                      placeholder: "Enter full address",
                    })}
                  </div>

                  <div className="lead-form-full">
                    <div className="lead-location-row">
                      <div>
                        {field("pincode", "Pincode", {
                          placeholder: "Enter 6-digit pincode",
                          hint: pincodeLoading
                            ? "Fetching location..."
                            : pincodeMessage,
                        })}
                      </div>

                      <div>
                        {field("city", "City", {
                          placeholder: "City",
                        })}
                      </div>

                      <div>
                        {field("state", "State", {
                          placeholder: "State",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* LEAD DETAILS */}
            <section className="lead-form-section">
              <div className="lead-form-section-title">
                <ClipboardList size={16} />
                <h3>Lead Details</h3>
              </div>

              <div className="lead-form-grid">
                {field("leadSource", "Lead Source", {
                  type: "select",
                  options: leadSources,
                  required: true,
                })}

                {field("campaignName", "Campaign Name", {
                  placeholder: "Enter campaign name",
                })}

                {field("interestedPlan", "Interested Plan", {
                  required: true,
                  type: "select",
                  options: [
                    { label: "Basic", value: "Basic" },
                    { label: "Standard", value: "Standard" },
                    { label: "Premium", value: "Premium" },
                    { label: "Premium Plus", value: "Premium Plus" },
                    { label: "Enterprise", value: "Enterprise" },
                    { label: "Custom", value: "Custom" },
                  ],
                })}
                <FormField
                  label="Assign Staff"
                  name="assignStaff"
                  type="select"
                  value={formData.assignStaff}
                  onChange={handleChange}
                  options={staffOptions}
                  placeholder="Unassigned"
                  hint="Staff list will be connected to the staff API."
                />

                {field("leadPriority", "Lead Priority", {
                  type: "select",
                  options: leadPriorities,
                })}
                {field("leadStatus", "Lead Status", {
                  type: "select",
                  options: leadStatuses,
                })}

                {field("expectedPurchaseDate", "Expected Purchase Date", {
                  type: "date",
                })}

                {field("estimatedValue", "Estimated Value (₹)", {
                  placeholder: "e.g. 50000",
                })}

                {field("nextFollowUpDateTime", "Next Follow-up Date & Time", {
                  type: "datetime-local",
                })}

                {field("remarks", "Remarks", {
                  type: "textarea",
                  placeholder: "Enter remarks or notes...",
                  rows: 3,
                })}

                {!isEditMode && (
                  <div className="lead-form-full">
                    <div className="form-field">
                      <div className="lead-attachment-header">
                        <label className="form-field-label">
                          Attached Files
                        </label>

                        <span className="lead-attachment-count">
                          {selectedFiles.length}/5 files
                        </span>
                      </div>

                      <div className="lead-attachment-grid">
                        {selectedFiles.map((item) => {
                          const isImage = item.file.type.startsWith("image/");
                          const isPdf = item.file.type === "application/pdf";

                          return (
                            <div className="lead-attachment-card" key={item.id}>
                              <button
                                type="button"
                                className="lead-attachment-preview-btn"
                                onClick={() => setPreviewFile(item)}
                                title="Preview file"
                              >
                                {isImage ? (
                                  <img src={item.url} alt={item.file.name} />
                                ) : isPdf ? (
                                  <FileText size={28} />
                                ) : (
                                  <FilePlus2 size={28} />
                                )}

                                <span className="lead-attachment-eye">
                                  <Eye size={15} />
                                </span>
                              </button>

                              <button
                                type="button"
                                className="lead-attachment-remove"
                                onClick={() => removeFile(item.id)}
                                title="Remove file"
                                aria-label={`Remove ${item.file.name}`}
                              >
                                <X size={13} />
                              </button>

                              <div className="lead-attachment-info">
                                <span title={item.file.name}>
                                  {item.file.name}
                                </span>
                                <small>{formatFileSize(item.file.size)}</small>
                              </div>
                            </div>
                          );
                        })}

                        {selectedFiles.length < MAX_FILES && (
                          <label className="lead-attachment-add">
                            <FilePlus2 size={22} />

                            <span>Add Files</span>
                            <small>Max 5 MB each</small>

                            <input
                              type="file"
                              multiple
                              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                              onChange={handleFileChange}
                              hidden
                            />
                          </label>
                        )}
                      </div>

                      {fileError && (
                        <small className="form-field-error" role="alert">
                          {fileError}
                        </small>
                      )}
                    </div>
                    {previewFile && (
                      <div
                        className="lead-file-modal-overlay"
                        onClick={() => setPreviewFile(null)}
                      >
                        <div
                          className="lead-file-modal"
                          role="dialog"
                          aria-modal="true"
                          aria-label="File preview"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="lead-file-modal-header">
                            <strong>{previewFile.file.name}</strong>

                            <button
                              type="button"
                              onClick={() => setPreviewFile(null)}
                              aria-label="Close preview"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <div className="lead-file-modal-body">
                            {previewFile.file.type.startsWith("image/") ? (
                              <img
                                src={previewFile.url}
                                alt={previewFile.file.name}
                              />
                            ) : previewFile.file.type === "application/pdf" ? (
                              <iframe
                                src={previewFile.url}
                                title={previewFile.file.name}
                              />
                            ) : (
                              <div className="lead-file-no-preview">
                                <FileText size={42} />
                                <p>
                                  Preview is not available for this file type.
                                </p>
                                <a
                                  href={previewFile.url}
                                  download={previewFile.file.name}
                                >
                                  Download File
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="lead-form-actions">
            <Button
              type="button"
              variant="outlined"
              disabled={loading}
              onClick={() => navigate("/leads")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={pincodeLoading}
            >
              {isEditMode ? "Update Lead" : "Create Lead"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
