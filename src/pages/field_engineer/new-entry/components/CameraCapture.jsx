import React, { useRef, useState, useEffect } from "react";

export default function CameraCapture({ photos = [], setPhotos, fieldLabel = "Photos" }) {
  const videoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  const startCamera = async () => {
    setCapturing(true);
    setError("");
    setCameraReady(false);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera not supported in this browser");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (!videoRef.current) throw new Error("Video element not found");
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current.play();
          setCameraReady(true);
        } catch (e) {
          setError(`Cannot play camera: ${e.message}`);
        }
      };
    } catch (err) {
      setError(`Camera access denied: ${err.message}`);
      setCapturing(false);
    }
  };

  const stopCamera = () => {
    videoRef.current?.srcObject?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCapturing(false);
    setCameraReady(false);
  };

  const capturePhoto = () => {
    if (!cameraReady || !videoRef.current) return;
    const { videoWidth: w, videoHeight: h } = videoRef.current;
    if (!w || !h) { setError("Camera not ready."); return; }
    navigator.geolocation.getCurrentPosition(
      (loc) => {
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0, w, h);
        setPhotos([...photos, {
          id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
          url: canvas.toDataURL("image/jpeg", 0.92),
          caption: "",
          pointLocation: { type: "Point", coordinates: [loc.coords.longitude, loc.coords.latitude] },
          capturedAt: new Date().toISOString(),
        }]);
        setError("");
      },
      (e) => setError(`GPS failed: ${e.message}`),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const removePhoto = (id) => setPhotos(photos.filter((p) => p.id !== id));
  const updateCaption = (id, caption) => setPhotos(photos.map((p) => p.id === id ? { ...p, caption } : p));

  useEffect(() => () => stopCamera(), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Camera viewer */}
      <div style={{ borderRadius: 14, border: "1.5px solid var(--border)", overflow: "hidden", background: "rgba(0,0,0,.6)" }}>
        {!capturing ? (
          <button
            type="button"
            onClick={startCamera}
            style={{
              width: "100%",
              padding: "20px 0",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              color: "var(--text2)",
            }}
          >
            <span style={{ fontSize: 32 }}>📷</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>Open Camera</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>Rear camera · GPS-tagged</span>
          </button>
        ) : (
          <div style={{ position: "relative" }}>
            <video
              ref={videoRef}
              autoPlay playsInline muted
              style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block", background: "#000" }}
            />
            {!cameraReady && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.65)", color: "#fff", fontSize: 13 }}>
                Starting camera…
              </div>
            )}
            {/* Bottom action bar */}
            <div style={{ display: "flex", gap: 8, padding: "10px 12px", background: "rgba(0,0,0,.5)", position: "absolute", bottom: 0, left: 0, right: 0, justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={stopCamera}
                style={{ padding: "8px 14px", fontSize: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "#fff", cursor: "pointer" }}
              >
                ✕ Close
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                disabled={!cameraReady}
                style={{
                  padding: "10px 22px", fontSize: 13, fontWeight: 700,
                  borderRadius: 10, border: "none",
                  background: cameraReady ? "var(--accent)" : "rgba(255,255,255,.15)",
                  color: cameraReady ? "var(--navy)" : "rgba(255,255,255,.4)",
                  cursor: cameraReady ? "pointer" : "default",
                  transition: "all .15s",
                }}
              >
                📸 {cameraReady ? "Capture + GPS" : "Initializing…"}
              </button>
            </div>
          </div>
        )}
        {error && (
          <div style={{ color: "var(--red)", fontSize: 12, padding: "8px 14px", borderTop: "1px solid var(--border)", background: "rgba(239,68,68,.07)" }}>
            ⚠ {error}
          </div>
        )}
      </div>

      {/* Photo thumbnails */}
      {photos.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {photos.map((p) => (
            <div key={p.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(255,255,255,.04)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 10px" }}>
              <div style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid var(--border)", background: "#000" }}>
                <img src={p.url} alt={p.caption || "capture"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <input
                  className="form-control"
                  value={p.caption}
                  onChange={(e) => updateCaption(p.id, e.target.value)}
                  placeholder="Caption (optional)…"
                  style={{ fontSize: 13 }}
                />
                {p.pointLocation?.coordinates && (
                  <div style={{ marginTop: 4, fontSize: 10, color: "var(--text3)" }}>
                    📍 {p.pointLocation.coordinates[1].toFixed(5)}, {p.pointLocation.coordinates[0].toFixed(5)}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => removePhoto(p.id)} style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 16, cursor: "pointer", padding: 4, flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}