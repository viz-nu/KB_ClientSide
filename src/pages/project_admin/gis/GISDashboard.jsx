import { useEffect, useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { MOCK_ENTRIES } from '../../../constants/scheduleN.js';
import {  PageHeader, StatusBadge,} from '../../../components/common/index.jsx';


// ─── GIS Dashboard ───────────────────────────────────────────────
export default function GISDashboard() {
  const { user } = useAuth();
  const mapRef    = useRef(null);
  const leafletRef = useRef(null);

  useEffect(() => {
    if (leafletRef.current) return;

    const init = () => {
      const L = window.L;
      if (!mapRef.current || !L) return;
      const map = L.map(mapRef.current, { center: [17.385, 78.49], zoom: 11 });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      const colorMap = { APPROVED: '#22C55E', PENDING: '#FBBF24', REJECTED: '#EF4444', RETURNED: '#A855F7', DRAFT: '#94A3B8' };
      MOCK_ENTRIES.forEach(e => {
        if (!e.gpsLat || !e.gpsLng) return;
        const color = colorMap[e.status];
        const icon = L.divIcon({
          html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.5)"></div>`,
          iconSize: [16, 16], className: '',
        });
        L.marker([e.gpsLat, e.gpsLng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:200px;padding:4px">
              <strong style="font-size:13px">${e.title}</strong><br/>
              <span style="font-size:11px;color:#666">${e.workCategory?.split(' (')[0]}</span><br/>
              <span style="color:${color};font-weight:600;font-size:12px">${e.status}</span><br/>
              <span style="font-size:11px">👷 ${e.engineer.name}</span><br/>
              <span style="font-size:12px;font-weight:600">₹${e.totalAmount?.toLocaleString()}</span>
            </div>
          `);
      });
      leafletRef.current = map;
    };

    if (window.L) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.onload = init;
    document.head.appendChild(s);
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(l);

    return () => { if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null; } };
  }, []);

  return (
    <div className="fade-up">
      <PageHeader title="GIS Dashboard" subtitle={`Geographic view of field work — user span name goes here ${user.span?.name}`} />
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">📍 Entry Locations</span>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[['APPROVED','#22C55E'],['PENDING','#FBBF24'],['REJECTED','#EF4444'],['RETURNED','#A855F7']].map(([s,c]) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text2)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="map-container" ref={mapRef} />
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Entry Index</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Engineer</th><th>GPS</th><th>Status</th><th>Amount</th></tr></thead>
            <tbody>
              {MOCK_ENTRIES.map(e => (
                <tr key={e.id}>
                  <td style={{ fontSize: 13 }}>{e.title}</td>
                  <td style={{ fontSize: 11 }}>{e.workCategory?.split(' (')[0]}</td>
                  <td style={{ fontSize: 12 }}>{e.engineer.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text2)' }}>{e.gpsLat?.toFixed(4)}, {e.gpsLng?.toFixed(4)}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>₹{e.totalAmount?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}