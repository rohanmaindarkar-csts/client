export const staff = [
  { id: 's1', name: 'Amit Sharma', role: 'Sales Executive', activeLeads: 18, initials: 'AS' },
  { id: 's2', name: 'Priya Patil', role: 'Sales Executive', activeLeads: 12, initials: 'PP' },
  { id: 's3', name: 'Rahul Deshmukh', role: 'Sales Manager', activeLeads: 23, initials: 'RD' },
  { id: 's4', name: 'Sneha Kulkarni', role: 'Sales Executive', activeLeads: 9, initials: 'SK' },
];
const today = new Date();
const day = (offset, hour=11) => { const d = new Date(today); d.setDate(d.getDate()+offset); d.setHours(hour,30,0,0); return d.toISOString(); };
export const leads = [
  { id:'l1', businessName:'Nova Retail Solutions', ownerName:'Rajesh Mehta', contactPersonName:'Rajesh Mehta', mobileNo:'9876543210', alternateMobileNo:'', email:'rajesh@novaretail.in', businessType:'Retail', noOfBranch:3, address:'Baner Main Road', city:'Pune', state:'Maharashtra', pincode:'411045', leadSource:'Website', campaignName:'October Website', interestedPlan:'Premium', leadPriority:'High', estimatedValue:85000, stage:'Proposal', assignedTo:'s1', nextFollowUpDateTime:day(0,11), expectedPurchaseDate:day(12), remarks:'Needs multi-branch inventory and reporting.', createdAt:day(-12), attachedFiles:[] },
  { id:'l2', businessName:'BluePeak Distributors', ownerName:'Neha Shah', contactPersonName:'Sahil Shah', mobileNo:'9876543211', email:'sales@bluepeak.in', businessType:'Distributor', noOfBranch:5, address:'FC Road', city:'Pune', state:'Maharashtra', pincode:'411004', leadSource:'Reference', campaignName:'', interestedPlan:'Enterprise', leadPriority:'Urgent', estimatedValue:175000, stage:'Negotiation', assignedTo:'s3', nextFollowUpDateTime:day(0,15), expectedPurchaseDate:day(8), remarks:'Awaiting revised commercial proposal.', createdAt:day(-20), attachedFiles:[] },
  { id:'l3', businessName:'GreenLeaf Foods', ownerName:'Anjali Rao', contactPersonName:'Anjali Rao', mobileNo:'9876543212', email:'anjali@greenleaf.in', businessType:'Manufacturer', noOfBranch:2, address:'Hinjewadi Phase 1', city:'Pune', state:'Maharashtra', pincode:'411057', leadSource:'Social Media', campaignName:'Instagram', interestedPlan:'Standard', leadPriority:'Medium', estimatedValue:42000, stage:'Qualified', assignedTo:'s2', nextFollowUpDateTime:day(1,10), expectedPurchaseDate:day(18), remarks:'Requested product demonstration.', createdAt:day(-7), attachedFiles:[] },
  { id:'l4', businessName:'Orbit Tech Services', ownerName:'Kunal Joshi', contactPersonName:'Kunal Joshi', mobileNo:'9876543213', email:'kunal@orbittech.in', businessType:'Service Provider', noOfBranch:1, address:'Kharadi', city:'Pune', state:'Maharashtra', pincode:'411014', leadSource:'Cold Call', campaignName:'', interestedPlan:'Basic', leadPriority:'Low', estimatedValue:18000, stage:'New', assignedTo:null, nextFollowUpDateTime:day(3,14), expectedPurchaseDate:day(30), remarks:'Call again after internal discussion.', createdAt:day(-2), attachedFiles:[] },
  { id:'l5', businessName:'Sunrise Wholesale', ownerName:'Farhan Khan', contactPersonName:'Farhan Khan', mobileNo:'9876543214', email:'farhan@sunrise.in', businessType:'Wholesale', noOfBranch:4, address:'Market Yard', city:'Pune', state:'Maharashtra', pincode:'411037', leadSource:'Walk-in', campaignName:'', interestedPlan:'Premium Plus', leadPriority:'High', estimatedValue:99000, stage:'Demo', assignedTo:'s4', nextFollowUpDateTime:day(7,12), expectedPurchaseDate:day(15), remarks:'Demo completed; awaiting feedback.', createdAt:day(-15), attachedFiles:[] },
  { id:'l6', businessName:'Metro Pharmacy', ownerName:'Deepak More', contactPersonName:'Deepak More', mobileNo:'9876543215', email:'deepak@metro.in', businessType:'Retail', noOfBranch:2, address:'Wakad', city:'Pune', state:'Maharashtra', pincode:'411057', leadSource:'Advertisement', campaignName:'Local Search', interestedPlan:'Standard', leadPriority:'Medium', estimatedValue:35000, stage:'Contacted', assignedTo:null, nextFollowUpDateTime:day(9,16), expectedPurchaseDate:day(40), remarks:'Wants a callback next week.', createdAt:day(-4), attachedFiles:[] },
];
export const pipelineStages = ['New','Contacted','Qualified','Demo','Proposal','Negotiation','Won'];
export const communicationHistory = [
 { id:'c1', leadId:'l1', type:'Call', title:'Discussed premium plan requirements', note:'Client needs stock visibility across all branches.', by:'Amit Sharma', date:day(-1,16) },
 { id:'c2', leadId:'l1', type:'Email', title:'Sent pricing proposal', note:'Shared product brochure and annual pricing.', by:'Amit Sharma', date:day(-3,12) },
 { id:'c3', leadId:'l1', type:'Meeting', title:'Product walkthrough', note:'Walked through dashboard and reporting.', by:'Priya Patil', date:day(-6,11) },
 { id:'c4', leadId:'l2', type:'Call', title:'Negotiated implementation cost', note:'Requested updated proposal.', by:'Rahul Deshmukh', date:day(-1,13) },
];
export const assignmentHistory = [
 {id:'a1', leadId:'l1', from:'Priya Patil', to:'Amit Sharma', by:'Rahul Deshmukh', date:day(-5), reason:'Territory realignment'},
 {id:'a2', leadId:'l1', from:'Unassigned', to:'Priya Patil', by:'Admin', date:day(-12), reason:'Initial assignment'},
 {id:'a3', leadId:'l2', from:'Unassigned', to:'Rahul Deshmukh', by:'Admin', date:day(-20), reason:'High-value lead'},
];
export const followUpHistory = [
 {id:'f1', leadId:'l1', date:day(-1), outcome:'Completed', note:'Proposal reviewed. Follow-up scheduled for today.', by:'Amit Sharma'},
 {id:'f2', leadId:'l1', date:day(-6), outcome:'Completed', note:'Demo completed.', by:'Priya Patil'},
 {id:'f3', leadId:'l2', date:day(-2), outcome:'Rescheduled', note:'Decision maker unavailable.', by:'Rahul Deshmukh'},
];
export const auditLogs = [
 {id:'u1', leadId:'l1', action:'Stage updated', detail:'Demo → Proposal', by:'Amit Sharma', date:day(-3)},
 {id:'u2', leadId:'l1', action:'Staff reassigned', detail:'Priya Patil → Amit Sharma', by:'Rahul Deshmukh', date:day(-5)},
 {id:'u3', leadId:'l1', action:'Lead created', detail:'Lead added from website enquiry', by:'Admin', date:day(-12)},
];
export const formatDate = (value, time=false) => value ? new Date(value).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',...(time?{hour:'2-digit',minute:'2-digit'}:{})}) : '—';
export const getStaffName = (id) => staff.find(s=>s.id===id)?.name || 'Unassigned';


const dateOffset = (days, hour = 10, minute = 0) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const demoStaff = [
  { id: "s1", name: "Amit Sharma" },
  { id: "s2", name: "Priya Patil" },
  { id: "s3", name: "Rahul Deshmukh" },
  { id: "s4", name: "Sneha Kulkarni" },
];

export const demoLeads = [
  { id: "l1", businessName: "Sunrise Retail", ownerName: "Vikas Patil", status: "Qualified", staffId: "s1" },
  { id: "l2", businessName: "Metro Distributors", ownerName: "Anil Shah", status: "Negotiation", staffId: "s2" },
  { id: "l3", businessName: "Green Valley Foods", ownerName: "Ravi Jadhav", status: "New", staffId: "s3" },
  { id: "l4", businessName: "Prime Electronics", ownerName: "Kiran More", status: "Contacted", staffId: "s1" },
  { id: "l5", businessName: "Bluebird Services", ownerName: "Neha Joshi", status: "Lost", staffId: "s4" },
];

export const demoFollowUps = [
  { id: "f1", leadId: "l1", staffId: "s1", scheduledAt: dateOffset(0, 10), status: "Pending", type: "Call", remarks: "Discuss pricing and plan" },
  { id: "f2", leadId: "l2", staffId: "s2", scheduledAt: dateOffset(0, 15), status: "Pending", type: "Meeting", remarks: "Product demo" },
  { id: "f3", leadId: "l3", staffId: "s3", scheduledAt: dateOffset(1, 11), status: "Pending", type: "WhatsApp", remarks: "Share brochure" },
  { id: "f4", leadId: "l4", staffId: "s1", scheduledAt: dateOffset(-2, 14), status: "Pending", type: "Call", remarks: "Pending callback" },
  { id: "f5", leadId: "l2", staffId: "s2", scheduledAt: dateOffset(-1, 12), status: "Completed", type: "Email", remarks: "Proposal sent" },
  { id: "f6", leadId: "l3", staffId: "s3", scheduledAt: dateOffset(3, 16), status: "Rescheduled", type: "Meeting", remarks: "Customer requested later date" },
  { id: "f7", leadId: "l5", staffId: "s4", scheduledAt: dateOffset(2, 11), status: "Cancelled", type: "Call", remarks: "Lead not interested" },
];

export const demoAuditLogs = [
  {
    id: "a1", leadId: "l1", actionType: "STATUS_CHANGED",
    field: "status", previousValue: "Contacted", newValue: "Qualified",
    changedBy: "Amit Sharma", timestamp: dateOffset(-1, 11),
    reason: "Customer confirmed requirements",
  },
  {
    id: "a2", leadId: "l2", actionType: "FOLLOWUP_COMPLETED",
    field: "followUpStatus", previousValue: "Pending", newValue: "Completed",
    changedBy: "Priya Patil", timestamp: dateOffset(-1, 16),
    reason: "Proposal shared",
  },
  {
    id: "a3", leadId: "l3", actionType: "ASSIGNED",
    field: "assignedStaff", previousValue: "Unassigned", newValue: "Rahul Deshmukh",
    changedBy: "Admin", timestamp: dateOffset(-3, 10), reason: "New assignment",
  },
  {
    id: "a4", leadId: "l5", actionType: "LEAD_LOST",
    field: "status", previousValue: "Negotiation", newValue: "Lost",
    changedBy: "Admin", timestamp: dateOffset(-2, 13), reason: "Budget mismatch",
  },
];

export const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export const localDateKey = (value) => {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const toDateTimeLocal = (value) => {
  const d = new Date(value);
  return `${localDateKey(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const effectiveStatus = (followUp) =>
  followUp.status === "Pending" && new Date(followUp.scheduledAt) < new Date()
    ? "Overdue"
    : followUp.status;
