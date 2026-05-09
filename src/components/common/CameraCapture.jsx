import React from "react";
import { useRef, useState } from "react";

export default function CameraCapture({ photos, setPhotos }) {
  const videoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);

  // Start Camera
  const startCamera = async () => {
    setCapturing(true); setError(''); setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
        await videoRef.current.play();
      }
    } catch (err) {
      setError('Unable to access camera. Permission denied?');
      setCapturing(false);
    }
  };

  // Capture photo
  const capturePhoto = async () => {
    if (!videoRef.current || !cameraReady) {
      setError('Camera is not ready yet. Please wait a moment.');
      return;
    }
    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) {
      setError('Camera preview is not initialized yet.');
      return;
    }
    // Get position first
    navigator.geolocation.getCurrentPosition(async (loc) => {
      const { latitude, longitude } = loc.coords;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const url = canvas.toDataURL('image/jpeg', 0.95);
      // Attach photo to state
      setPhotos((prev) => [
        ...prev,
        {
          id: `${Date.now()}_${Math.random()}`,
          url,
          caption: `Photo [${new Date().toLocaleString()}]`,
          gpsLat: latitude,
          gpsLng: longitude,
          capturedAt: new Date().toISOString(),
        }
      ]);
      // Optionally stop camera stream after capture
      // videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      // setCapturing(false);
    }, (err) => setError("Failed to fetch GPS: " + err.message), { enableHighAccuracy: true, timeout: 10000 });
  };

  // Remove photo
  const removePhoto = (id) => setPhotos(photos.filter(p => p.id !== id));

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <div style={{
        padding: 14,
        borderRadius: 8,
        border: '1px solid var(--border)',
        background: 'rgba(255,255,255,.03)',
        marginBottom: 14,
        marginTop: 8,
        textAlign: 'center',
        minHeight: 80
      }}>
        {!capturing ? (
          <button className="btn btn-primary" onClick={startCamera} style={{fontSize:16}}>
            <span style={{fontSize:24, marginRight:8}}>📷</span> Start Camera
          </button>
        ) : (
          <>
            <video
              ref={videoRef}
              style={{ width: '100%', maxWidth: 320, borderRadius: 10, marginBottom: 10, background: '#000' }}
              autoPlay
              playsInline
              muted
            />
            <div>
              <button className="btn btn-success" onClick={capturePhoto} style={{fontSize:16}} disabled={!cameraReady}>
                <span style={{fontSize:20, marginRight:8}}>📸</span> Capture Photo (with GPS)
              </button>
              <button className="btn btn-outline" onClick={() => {
                if (videoRef.current && videoRef.current.srcObject){
                  videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                }
                setCapturing(false); setCameraReady(false);
              }} style={{marginLeft:10}}>
                Stop Camera
              </button>
            </div>
          </>
        )}
        {error && <div style={{ color: "#F43", marginTop: 10 }}>{error}</div>}
      </div>
      {photos.length > 0 && (
        <div className="photo-grid" style={{ marginTop: 16 }}>
          {photos.map(p => (
            <div key={p.id} className="photo-thumb">
              <img src={p.url} alt={p.caption} />
              {p.gpsLat && (
                <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,.75)', borderRadius: 4, padding: '2px 5px', fontSize: 9, color: '#fff' }}>
                  📍 GPS
                </div>
              )}
              <button
                onClick={() => removePhoto(p.id)}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,.7)', border: 'none', color: '#fff', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: 11 }}
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}