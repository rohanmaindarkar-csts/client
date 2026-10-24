import "./FormField.css";

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  error,
  hint,
  rows = 3,
  min,
  max,
  step,
  children,
}) {
  const id = `field-${name}`;

  const commonProps = {
    id,
    name,
    value: value ?? "",
    onChange,
    required,
    disabled,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field-label">
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>

      {type === "select" ? (
        <select
          {...commonProps}
          className={`form-field-control ${error ? "field-invalid" : ""}`}
        >
          <option value="">{placeholder || "Select..."}</option>

          {(options || []).map((option) => {
            const item =
              typeof option === "string"
                ? { value: option, label: option }
                : option;

            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
      ) : type === "textarea" ? (
        <textarea
          {...commonProps}
          className={`form-field-control form-field-textarea ${
            error ? "field-invalid" : ""
          }`}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          {...commonProps}
          type={type}
          className={`form-field-control ${error ? "field-invalid" : ""}`}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
        />
      )}

      {hint && !error && <small className="form-field-hint">{hint}</small>}

      {error && (
        <small id={`${id}-error`} className="form-field-error">
          {error}
        </small>
      )}

      {children}
    </div>
  );
}
