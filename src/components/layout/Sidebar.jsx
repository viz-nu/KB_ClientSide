import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useState } from "react";
import Logo from "../common/Logo.jsx";

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
  const [collapsed, setCollapsed] = useState(false);

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
        width: collapsed ? 64 : 240,
        flexShrink: 0,
        background: "linear-gradient(180deg, #0D1E3A 0%, #091629 100%)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
      }}
    >
{/* Logo */}
<div
  style={{
    padding: "16px 12px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 72,
    overflow: "hidden",
  }}
>
  {/* Left: icon + text */}
  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
    {/* Logo icon */}
    <Logo size={36} />

    <div
      style={{
        opacity: collapsed ? 0 : 1,
        transform: collapsed ? "translateX(-8px)" : "translateX(0)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        whiteSpace: "nowrap",
        pointerEvents: collapsed ? "none" : "auto",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontSize: 15,
          fontWeight: 800,
          color: "var(--accent)",
        }}
      >
        STWMB
      </div>
      <div
        style={{
          fontSize: 8,
          color: "var(--text2)",
          textTransform: "uppercase",
          letterSpacing: ".08em",
          marginTop: 1,
          lineHeight: 1.4,
        }}
      >
        Signaling &amp; Telecom
        <br />
        Works Measurement Book
      </div>
    </div>
  </div>

  {/* Toggle button — always present, shifts to center when collapsed */}
  <button
    onClick={() => setCollapsed((c) => !c)}
    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    style={{
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 6,
      color: "var(--text2)",
      width: 26,
      height: 26,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      flexShrink: 0,
      fontSize: 12,
      transition: "all .15s",
      padding: 0,
      marginLeft: collapsed ? "auto" : 8,
      marginRight: collapsed ? "auto" : 0,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,.12)";
      e.currentTarget.style.color = "var(--accent)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,.06)";
      e.currentTarget.style.color = "var(--text2)";
    }}
  >
    {collapsed ? "▶" : "◀"}
  </button>
</div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? "16px 8px" : "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          transition: "padding 0.25s ease",
        }}
      >
        {groups.map((group) => (
          <div key={group.group}>
            {/* Group label — hidden when collapsed */}
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: ".12em",
                margin: "12px 8px 4px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                opacity: collapsed ? 0 : 1,
                maxHeight: collapsed ? 0 : 20,
                transition: "opacity 0.2s ease, max-height 0.2s ease",
              }}
            >
              {group.group}
            </div>

            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                title={collapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: collapsed ? 0 : 10,
                  padding: collapsed ? "10px 0" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive ? "var(--accent)" : "var(--text2)",
                  background: isActive ? "rgba(244,160,28,.12)" : "transparent",
                  textDecoration: "none",
                  transition: "all .15s",
                  marginBottom: 2,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                })}
              >
                <span
                  style={{
                    fontSize: 16,
                    width: 20,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    opacity: collapsed ? 0 : 1,
                    maxWidth: collapsed ? 0 : 200,
                    overflow: "hidden",
                    transition: "opacity 0.2s ease, max-width 0.25s ease",
                  }}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer / user */}
      <div
        style={{
          padding: collapsed ? "16px 8px" : "16px 12px",
          borderTop: "1px solid var(--border)",
          transition: "padding 0.25s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 10,
            padding: collapsed ? "8px 0" : "10px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 8,
            background: "rgba(255,255,255,.04)",
            marginBottom: 8,
            overflow: "hidden",
            transition: "all 0.25s ease",
          }}
          title={collapsed ? `${user.name} (${user.role.replace(/_/g, " ")})` : undefined}
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
          <div
            style={{
              overflow: "hidden",
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : 160,
              transition: "opacity 0.2s ease, max-width 0.25s ease",
            }}
          >
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
                whiteSpace: "nowrap",
              }}
            >
              {user.role.replace(/_/g, " ")}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title={collapsed ? "Sign Out" : undefined}
          style={{
            width: "100%",
            padding: collapsed ? "8px 0" : "8px",
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
            gap: collapsed ? 0 : 6,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,.18)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,.1)")
          }
        >
          <span>↩</span>
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : 80,
              overflow: "hidden",
              transition: "opacity 0.2s ease, max-width 0.25s ease",
              whiteSpace: "nowrap",
            }}
          >
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}