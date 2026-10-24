import "./PageHeader.css";

export default function PageHeader({ title, description, children }) {
  return (
    <div className="page-header">
      <div className="page-header-info">
        <h1>{title}</h1>

        {description && <p>{description}</p>}
      </div>

      {children && <div className="page-header-actions">{children}</div>}
    </div>
  );
}
