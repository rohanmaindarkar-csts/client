import api from "./axiosInstance";

// Get all leads
export const getLeads = async (params = {}, signal) => {
  const response = await api.get("/leads", {
    params,
    signal,
  });

  return response.data;
};

// Get single lead by ID
export const getLeadById = async (id) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

// Create new lead
export const createLead = async (formData) => {
  const response = await api.post("/leads", formData);
  return response.data;
};

// Update existing lead
export const updateLead = async (id, data) => {
  const response = await api.put(`/leads/${id}`, data);
  return response.data;
};

// Delete lead
export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};
// Get city and state using pincode
export const getPincodeDetails = async (pincode) => {
  const response = await api.get(`/pincode/${pincode}`);
  return response.data;
};
