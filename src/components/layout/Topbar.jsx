import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/users": "User Management",
  "/entries": "e-MB Entries",
  "/engineers": "Field Engineers",
  "/gis": "GIS Dashboard",
  "/reports": "Reports",
  "/my-entries": "My Entries",
  "/new-entry": "New e-MB Entry",
  "/checklist": "SEM Checklist",
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = PAGE_TITLES[pathname] || "Dashboard";

  const now = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      style={{
        padding: "0 28px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        background: "rgba(10,22,40,.95)",
        backdropFilter: "blur(12px)",
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-head)",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {title}
      </h2>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 12, color: "var(--text2)" }}>{now}</span>

        {user?.role === "field_engineer" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 20,
              background: "rgba(34,197,94,.1)",
              border: "1px solid rgba(34,197,94,.2)",
              fontSize: 12,
              color: "var(--green)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--green)",
                display: "inline-block",
              }}
            />
            On Duty
          </div>
        )}

        <div
          style={{
            padding: "5px 14px",
            borderRadius: 20,
            background: "rgba(255,255,255,.04)",
            border: "1px solid var(--border)",
            fontSize: 12,
            color: "var(--text2)",
          }}
        >
          {user?.role?.replace(/_/g, " ")}
        </div>
      </div>
    </div>
  );
}
