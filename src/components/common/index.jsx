import { STATUS_CONFIG, ROLES } from "../../constants/scheduleN.js";

// ── Spinner ─────────────────────────────────────────────────────
export function Spinner({ size = 18, color = "var(--accent)" }) {
  return (
    <svg
      className="spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="31.4"
        strokeDashoffset="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Badge ────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="badge badge-role" style={{ "color": cfg?.color, }}>
      {cfg.label}
    </span>
  );
}

export function RoleBadge({ role }) {
  const cfg = ROLES[role];
  return (
    <span className="badge badge-role" style={{ "--badge-color": cfg?.color }}>
      {cfg?.label || role}
    </span>
  );
}

// ── Modal ────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer, size = "md" }) {
  const maxWidth = size === "lg" ? 860 : size === "sm" ? 420 : 680;
  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="fade-up"
        style={{
          background: "var(--navy4)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text2)",
              fontSize: 20,
              cursor: "pointer",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
            }}
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
        {footer && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid var(--border)",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ConfirmDialog ────────────────────────────────────────────────
export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  danger,
  loading,
}) {
  return (
    <Modal
      title="Confirm Action"
      onClose={onCancel}
      footer={
        <>
          <button
            className="btn btn-outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Spinner size={14} /> : "Confirm"}
          </button>
        </>
      }
    >
      <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>
        {message}
      </p>
    </Modal>
  );
}

// ── EmptyState ───────────────────────────────────────────────────
export function EmptyState({
  icon = "📭",
  title = "No data",
  message,
  action,
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px",
        color: "var(--text2)",
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontSize: 16,
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      {message && (
        <div style={{ fontSize: 13, maxWidth: 300, margin: "0 auto" }}>
          {message}
        </div>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

// ── PageHeader ───────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 24,
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {actions}
        </div>
      )}
    </div>
  );
}

// ── StatCard ─────────────────────────────────────────────────────
export function StatCard({
  icon,
  number,
  label,
  color = "var(--accent)",
  glow,
}) {
  return (
    <div
      className="stat-card"
      style={{ "--stat-color": color, "--stat-glow": glow || `${color}18` }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ── HealthBar ────────────────────────────────────────────────────
export function HealthBar({ label, value, color }) {
  const getColor = (v) =>
    v > 80 ? "#EF4444" : v > 60 ? "#FBBF24" : color || "#22C55E";
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "var(--text2)",
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span style={{ color: getColor(value), fontWeight: 600 }}>
          {value}%
        </span>
      </div>
      <div className="health-bar">
        <div
          className="health-fill"
          style={{ width: `${value}%`, background: getColor(value) }}
        />
      </div>
    </div>
  );
}

// ── FormField ────────────────────────────────────────────────────
export function FormField({ label, error, children, required, description }) {
  return (
    <div className="form-group" style={{ position: "relative" }}>
      <label
        className="form-label"
        style={{ display: "flex", alignItems: "center", gap: 6 }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--red)", marginLeft: 2 }}>*</span>
        )}
        {description && <InfoIcon description={description} />}
      </label>
      {children}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

function InfoIcon({ description }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
      tabIndex={0}
      role="tooltip"
      aria-label={description}
      onMouseEnter={(e) =>
        (e.currentTarget.querySelector(".tooltip").style.display = "block")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.querySelector(".tooltip").style.display = "none")
      }
      onFocus={(e) =>
        (e.currentTarget.querySelector(".tooltip").style.display = "block")
      }
      onBlur={(e) =>
        (e.currentTarget.querySelector(".tooltip").style.display = "none")
      }
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        style={{ cursor: "help", color: "var(--text3)", flexShrink: 0 }}
      >
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
        <text
          x="7"
          y="11"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="currentColor"
          fontFamily="var(--font-body)"
        >
          i
        </text>
      </svg>

      <span
        className="tooltip"
        style={{
          display: "none",
          position: "absolute",
          bottom: "calc(100% + 6px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--navy)",
          color: "var(--text)",
          fontSize: 11,
          lineHeight: 1.5,
          padding: "6px 10px",
          borderRadius: 6,
          whiteSpace: "pre-wrap",
          maxWidth: 220,
          width: "max-content",
          boxShadow: "0 2px 8px rgba(0,0,0,.25)",
          zIndex: 99,
          pointerEvents: "none",
          border: "1px solid var(--border)",
        }}
      >
        {description}
        {/* caret */}
        <span
          style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 8,
            height: 8,
            background: "var(--navy)",
            borderRight: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            rotate: "45deg",
          }}
        />
      </span>
    </span>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`tab-btn ${active === t.id ? "active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.icon && <span style={{ marginRight: 5 }}>{t.icon}</span>}
          {t.label}
          {t.count != null && (
            <span
              style={{
                marginLeft: 6,
                fontSize: 10,
                padding: "1px 6px",
                background:
                  active === t.id
                    ? "rgba(244,160,28,.2)"
                    : "rgba(255,255,255,.06)",
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── InfoRow ──────────────────────────────────────────────────────
export function InfoRow({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.03)",
        padding: "10px 12px",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "var(--text2)",
          marginBottom: 3,
          textTransform: "uppercase",
          letterSpacing: ".07em",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13 }}>{value || "—"}</div>
    </div>
  );
}

// ── AlertBanner ──────────────────────────────────────────────────
export function AlertBanner({ type = "info", message }) {
  const styles = {
    info: {
      bg: "rgba(59,130,246,.1)",
      border: "rgba(59,130,246,.3)",
      color: "#60A5FA",
      icon: "ℹ",
    },
    warning: {
      bg: "rgba(251,191,36,.1)",
      border: "rgba(251,191,36,.3)",
      color: "#FBBF24",
      icon: "⚠",
    },
    success: {
      bg: "rgba(34,197,94,.1)",
      border: "rgba(34,197,94,.3)",
      color: "#22C55E",
      icon: "✓",
    },
    error: {
      bg: "rgba(239,68,68,.1)",
      border: "rgba(239,68,68,.3)",
      color: "#EF4444",
      icon: "✕",
    },
  };
  const s = styles[type];
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        marginBottom: 16,
      }}
    >
      <span style={{ color: s.color, flexShrink: 0 }}>{s.icon}</span>
      <span style={{ fontSize: 13, color: s.color }}>{message}</span>
    </div>
  );
}
