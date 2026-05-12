import { useState } from "react";

export default function PhotoThumb({ photo }) {
  const [open, setOpen] = useState(false);

  // GeoJSON format: [longitude, latitude]
  const coords = photo?.pointLocation?.coordinates;
  const hasCoords =
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number";

  const longitude = hasCoords ? coords[0] : null;
  const latitude = hasCoords ? coords[1] : null;

  return (
    <>
      {/* Thumbnail */}
      <div
        onClick={() => setOpen(true)}
        style={{
          width: 72,
          height: 72,
          borderRadius: 6,
          overflow: "hidden",
          cursor: "pointer",
          border: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <img
          src={photo?.url}
          alt={photo?.caption || "photo"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card)",
              borderRadius: 12,
              overflow: "hidden",
              maxWidth: 480,
              width: "100%",
              border: "1px solid var(--border)",
            }}
          >
            <img
              src={photo?.url}
              alt={photo?.caption || "photo"}
              style={{
                width: "100%",
                display: "block",
                maxHeight: 360,
                objectFit: "contain",
              }}
            />

            <div style={{ padding: "10px 14px" }}>
              {/* Caption */}
              {photo?.caption && (
                <div
                  style={{
                    fontSize: 13,
                    marginBottom: 6,
                  }}
                >
                  {photo.caption}
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* Location */}
                {hasCoords ? (
                  <a
                    href={`https://maps.google.com/?q=${latitude},${longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    📍 {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </a>
                ) : (
                  <span />
                )}

                {/* Captured Date */}
                {photo?.capturedAt && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--text2)",
                    }}
                  >
                    {new Date(photo.capturedAt).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}