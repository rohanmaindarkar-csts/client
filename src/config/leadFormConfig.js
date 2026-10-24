export const businessTypes = [
  "Retail",
  "Wholesale",
  "Distributor",
  "Manufacturer",
  "Service Provider",
  "Other",
];

export const leadSources = [
  "Website",
  "Social Media",
  "Reference",
  "Walk-in",
  "Cold Call",
  "Advertisement",
  "Other",
];

export const leadPriorities = ["Low", "Medium", "High", "Urgent"];

export const initialLeadForm = {
  businessName: "",
  ownerName: "",
  contactPersonName: "",
  mobileNo: "",
  alternateMobileNo: "",
  email: "",
  businessType: "",
  noOfBranch: 1,
  address: "",
  city: "",
  state: "",
  pincode: "",

  leadSource: "",
  campaignName: "",
  interestedPlan: "",
  assignStaff: "",
  leadPriority: "Medium",
  expectedPurchaseDate: "",
  estimatedValue: "",
  remarks: "",
  nextFollowUpDateTime: "",
  attachedFiles: [],
};
