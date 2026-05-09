import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const NAV_CONFIG = {
  system_admin: [
    {
      group: "Administration",
      items: [
        { to: "/dashboard", icon: "📊", label: "My Dashboard" },
        { to: "/users", icon: "👥", label: "User Management" },
      ],
    },
  ],
  project_admin: [
    {
      group: "e-MB Management",
      items: [
        { to: "/dashboard", icon: "📊", label: "My Dashboard" },
        { to: "/projects", icon: "📑", label: "Projects" },
        { to: "/spans", icon: "🧩", label: "Spans" },
        { to: "/entries", icon: "📝", label: "e-MB Entries" },
        { to: "/engineers", icon: "👷", label: "Field Engineers" },
        { to: "/gis", icon: "🗺️", label: "GIS Dashboard" },
        { to: "/reports", icon: "📈", label: "Reports" },
      ],
    },
  ],
  field_engineer: [
    {
      group: "My Work",
      items: [
        { to: "/dashboard", icon: "📊", label: "My Dashboard" },
        { to: "/new-entry", icon: "➕", label: "New Entry" },
        { to: "/my-entries", icon: "📋", label: "My Entries" },
      ],
    },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const groups = NAV_CONFIG[user.role] || [];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: "linear-gradient(180deg, #0D1E3A 0%, #091629 100%)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "22px 20px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 28 }}>🚂</div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 17,
                fontWeight: 800,
                color: "var(--accent)",
              }}
            >
              e-MB Portal
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--text2)",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                marginTop: 1,
              }}
            >
              Rail Signalling · Sch-N
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {groups.map((group) => (
          <div key={group.group}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: ".12em",
                margin: "12px 8px 4px",
              }}
            >
              {group.group}
            </div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive ? "var(--accent)" : "var(--text2)",
                  background: isActive ? "rgba(244,160,28,.12)" : "transparent",
                  textDecoration: "none",
                  transition: "all .15s",
                  marginBottom: 2,
                })}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer / user */}
      <div
        style={{ padding: "16px 12px", borderTop: "1px solid var(--border)" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 8,
            background: "rgba(255,255,255,.04)",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              color: "var(--navy)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--text2)",
                textTransform: "capitalize",
              }}
            >
              {user.role.replace(/_/g, " ")}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "8px",
            background: "rgba(239,68,68,.1)",
            border: "1px solid rgba(239,68,68,.2)",
            borderRadius: 8,
            color: "var(--red)",
            fontSize: 12,
            cursor: "pointer",
            transition: "all .15s",
            fontFamily: "var(--font-body)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,.18)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,.1)")
          }
        >
          <span>↩</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
