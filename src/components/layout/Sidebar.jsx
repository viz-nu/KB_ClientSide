import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useState } from "react";

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
<div style={{ flexShrink: 0, width: 36, height: 36 }}>
  <svg viewBox="0 0 100 110" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
    {/* Tower legs */}
    <line x1="50" y1="48" x2="22" y2="100" stroke="#4A6080" strokeWidth="2.5"/>
    <line x1="50" y1="48" x2="78" y2="100" stroke="#4A6080" strokeWidth="2.5"/>
    <line x1="36" y1="74" x2="64" y2="74" stroke="#4A6080" strokeWidth="1.8"/>
    <line x1="28" y1="88" x2="72" y2="88" stroke="#4A6080" strokeWidth="1.8"/>
    {/* Mast */}
    <line x1="50" y1="48" x2="50" y2="8" stroke="#E8EEF7" strokeWidth="2.5"/>
    <line x1="40" y1="24" x2="60" y2="24" stroke="#E8EEF7" strokeWidth="2"/>
    <line x1="43" y1="16" x2="57" y2="16" stroke="#E8EEF7" strokeWidth="2"/>
    {/* Tip glow */}
    <circle cx="50" cy="7" r="4" fill="#F4A01C"/>
    {/* Signal arcs */}
    <path d="M 30 30 A 24 24 0 0 1 70 30" stroke="#F4A01C" strokeWidth="2.2" fill="none" opacity="0.9"/>
    <path d="M 18 20 A 38 38 0 0 1 82 20" stroke="#F4A01C" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M 6 10 A 52 52 0 0 1 94 10" stroke="#F4A01C" strokeWidth="1" fill="none" opacity="0.25"/>
    {/* Base */}
    <rect x="44" y="100" width="12" height="8" rx="2" fill="#4A6080"/>
    <rect x="30" y="107" width="40" height="4" rx="2" fill="#4A6080"/>
  </svg>
</div>
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