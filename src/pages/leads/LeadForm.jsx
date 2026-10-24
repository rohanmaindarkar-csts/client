import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
// import { leadApi } from "../../api/leadApi";
import Button from "../../components/common/Button";
import "./LeadForm.css";

export default function LeadForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing lead in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    let active = true;

    const fetchLead = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await leadApi.getById(id);

        if (active) {
          // Adjust according to backend response
          setFormData(response.data.data);
        }
      } catch (error) {
        if (active) {
          setError(
            error.response?.data?.message || "Failed to fetch lead details.",
          );
        }
      } finally {
        if (active) setFetching(false);
      }
    };

    fetchLead();

    return () => {
      active = false;
    };
  }, [id, isEditMode]);

  // Common input change handler
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create or update lead
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (isEditMode) {
        await leadApi.update(id, formData);
      } else {
        await leadApi.create(formData);
      }

      navigate("/leads");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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
        <div className="lead-form-container">
          <p>Loading lead details...</p>
        </div>
      ) : (
        <form className="lead-form-container" onSubmit={handleSubmit}>
          {error && (
            <p className="lead-form-error" role="alert">
              {error}
            </p>
          )}

          <div className="lead-form-fields">
            {/* Add actual fields here later */}
          </div>

          <div className="lead-form-actions">
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/leads")}
            >
              Cancel
            </Button>

            <Button type="submit" variant="primary" loading={loading}>
              {isEditMode ? "Update Lead" : "Create Lead"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
