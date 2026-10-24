
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import "./Modal.css";

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  showCloseButton = true,
}) {
  const titleId = useId();
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (!focusable.length) {
          event.preventDefault();
          modalRef.current.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="common-modal-overlay"
      onMouseDown={(event) => {
        if (closeOnOverlay && event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`common-modal common-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? "Dialog" : undefined}
        tabIndex={-1}
      >
        <div className="common-modal-header">
          <div className="common-modal-heading">
            {title && <h2 id={titleId}>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>

          {showCloseButton && (
            <button
              ref={closeRef}
              type="button"
              className="common-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="common-modal-body">{children}</div>

        {footer && (
          <div className="common-modal-footer">{footer}</div>
        )}
      </div>
    </div>
  );
}
