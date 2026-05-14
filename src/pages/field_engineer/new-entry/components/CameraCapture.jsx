import React, { useRef, useState, useEffect } from "react";

export default function CameraCapture({
  photos = [],
  setPhotos,
  fieldLabel = "Photos",
}) {
  const videoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);



  const startCamera = async () => {
    setCapturing(true);
    setError("");
    setCameraReady(false);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser");
      }

      const constraints = {
        video: {
          facingMode: "environment",
        },
      };


      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!videoRef.current)throw new Error("Video element not found");
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current.play();
          setCameraReady(true);
        } catch (playErr) {
          console.error("video.play() failed:", playErr);
          setError(`Unable to play camera preview: ${playErr.message}`);
        }
      };
    } catch (err) {
      console.error("startCamera() failed:", err);
      setError(`Unable to access camera: ${err.message}`);
      setCapturing(false);
    }
  };

  /**
   * Stop camera
   */
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    if (videoRef.current)  videoRef.current.srcObject = null;
    setCapturing(false);
    setCameraReady(false);
  };

  /**
   * Capture photo + GPS
   */
  const capturePhoto = () => {
    if (!videoRef.current) {
      setError("Video element not available.");
      return;
    }

    if (!cameraReady) {
      setError("Camera not ready yet.");
      return;
    }

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;


    if (!width || !height) {
      setError("Camera preview not initialized.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (loc) => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error("Unable to get canvas context");
          }
          ctx.drawImage(videoRef.current, 0, 0, width, height);
          const imageUrl = canvas.toDataURL("image/jpeg", 0.92);
          const newPhoto = {
            id: `${Date.now()}_${Math.random()
              .toString(36)
              .slice(2)}`,
            url: imageUrl,
            caption: "",
            pointLocation: {
              type: "Point",
              coordinates: [
                loc.coords.longitude,
                loc.coords.latitude,
              ],
            },
            capturedAt: new Date().toISOString(),
          }
          setPhotos([...photos, newPhoto]);
          setError("");
        } catch (err) {
          console.error("Capture processing failed:", err);
          setError(`Capture failed: ${err.message}`);
        }
      },
      (geoErr) => {
        console.error("Geolocation failed:", geoErr);
        setError(`GPS failed: ${geoErr.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /**
   * Remove photo
   */
  const removePhoto = (id) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
  };

  /**
   * Update caption
   */
  const updateCaption = (id, caption) => {

    const updated = photos.map((p) =>
      p.id === id ? { ...p, caption } : p
    );

    setPhotos(updated);
  };

  /**
   * Debug photos prop changes
   */
  useEffect(() => {
  }, [photos]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div>
      <div
        style={{
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "rgba(255,255,255,.03)",
          marginBottom: 12,
          overflow: "hidden",
        }}
      >
        {!capturing ? (
          <div style={{ padding: 20, textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={startCamera}
            >
              📷 Start Camera
            </button>
            <div
              style={{
                fontSize: 11,
                color: "var(--text3)",
                marginTop: 8,
              }}
            >
              Rear camera · GPS-tagged capture
            </div>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                maxHeight: 280,
                objectFit: "cover",
                display: "block",
                background: "#000",
              }}
            />

            {!cameraReady && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,.6)",
                  color: "#fff",
                }}
              >
                Starting camera...
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                padding: "10px 14px",
                background: "rgba(0,0,0,.45)",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <button
                type="button"
                className="btn btn-success"
                onClick={capturePhoto}
                disabled={!cameraReady}
              >
                📸 {cameraReady ? "Capture + GPS" : "Initializing..."}
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={stopCamera}
              >
                ✕ Stop
              </button>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              color: "var(--red)",
              fontSize: 12,
              padding: "8px 14px",
              borderTop: "1px solid var(--border)",
            }}
          >
            ⚠ {error}
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {photos.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                background: "rgba(255,255,255,.04)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 10px",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 6,
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid var(--border)",
                  background: "#000",
                }}
              >
                <img
                  src={p.url}
                  alt={p.caption || "capture"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <input
                  className="form-control"
                  value={p.caption}
                  onChange={(e) =>
                    updateCaption(p.id, e.target.value)
                  }
                  placeholder="Add caption (optional)…"
                />

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 10,
                    color: "var(--text3)",
                  }}
                >
                  {p.pointLocation?.coordinates && (
                    <span>
                      📍 {p.pointLocation.coordinates[1].toFixed(5)},{" "}
                      {p.pointLocation.coordinates[0].toFixed(5)}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removePhoto(p.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}