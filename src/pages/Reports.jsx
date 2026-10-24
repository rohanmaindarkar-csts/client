import { ChartNoAxesCombined } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import "./Reports.css";

export default function Reports() {
  return (
    <div className="reports-page">
      <PageHeader
        title="Reports"
        description="View lead performance and conversion reports."
      />

      <div className="reports-content">
        <ChartNoAxesCombined size={36} strokeWidth={1.5} />
        <h3>Lead Reports</h3>
        <p>Lead analytics and reports will appear here.</p>
      </div>
    </div>
  );
}
