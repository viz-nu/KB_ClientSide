import {
  FormField,
  AlertBanner,
} from "../../../../components/common/index.jsx";
import { CHAPTERS_N } from "../../../../constants/scheduleN.js";
import { useEmbForm } from "../../../../hooks/useEmbForm.js";

export default function StepBasicInfo({ form, set, captureGPS }) {
  
  return (
    <div>
      {/* <FormField label="Entry Title" required>
        <input
          className="form-control"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Cable Laying — Secunderabad Outer Yard Km 12.4 to 14.9"
        />
      </FormField> */}
      <FormField label="Work Category (Schedule-N)" required>
        <select
          className="form-control"
          value={form.workCategory}
          onChange={(e) => {
            set("workCategory", e.target.value);
            set("lineItems", []);
            set("semChecklist", []);
          }}
        >
          <option value="">Select category…</option>
          {CHAPTERS_N.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </FormField>
      {form.workCategory && (
        <AlertBanner
          type="info"
          message={`${CHAPTERS_N?.find((t)=>t.name==form.workCategory)?.items.length} line items available for ${form.workCategory}`}
        />
      )}
      <FormField label="Location Description" required>
        <input
          className="form-control"
          value={form.locationDescription}
          onChange={(e) => set("locationDescription", e.target.value)}
          placeholder="e.g. Between Km 12.4 and 14.9, Up Main Line, Secunderabad Outer Yard"
        />
      </FormField>
      {/* <div className="form-row">
        <FormField label="GPS Latitude">
          <input
            className="form-control"
            value={form.gpsLat}
            onChange={(e) => set("gpsLat", e.target.value)}
            placeholder="17.432600"
          />
        </FormField>
        <FormField label="GPS Longitude">
          <input
            className="form-control"
            value={form.gpsLng}
            onChange={(e) => set("gpsLng", e.target.value)}
            placeholder="78.501300"
          />
        </FormField>
      </div> */}
      {/* <button className="btn btn-outline btn-sm" onClick={captureGPS}>
        📍 Capture Current GPS Location
      </button> */}
      {/* {form.gpsLat && form.gpsLng && (
        <span style={{ marginLeft: 10, fontSize: 12, color: "var(--green)" }}>
          ✓ GPS captured: {form.gpsLat}, {form.gpsLng}
        </span>
      )} */}
    </div>
  );
}
