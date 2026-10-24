import { LoaderCircle } from "lucide-react";
import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "sm",
  type = "button",
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}) {
  const variants = ["primary", "secondary", "outlined", "ghost", "danger"];

  const sizes = ["sm", "md", "lg"];

  const selectedVariant = variants.includes(variant) ? variant : "primary";

  const selectedSize = sizes.includes(size) ? size : "sm";

  return (
    <button
      type={type}
      className={[
        "app-btn",
        `app-btn-${selectedVariant}`,
        `app-btn-${selectedSize}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <LoaderCircle size={14} className="app-btn-spinner" />
      ) : (
        Icon && <Icon size={14} />
      )}

      {children && <span className="app-btn-label">{children}</span>}

      {!loading && IconRight && <IconRight size={14} />}
    </button>
  );
}
