import CameraCapture from "../../../../components/common/CameraCapture";
export default function StepPhotosSubmit({ form, set, semParams }) {

  return (
    <div>
      <div className="card-title" style={{ marginBottom: 16 }}>
        Capture GPS-Tagged Photographs
      </div>
      <CameraCapture
        photos={form.photos}
        setPhotos={(photos) => set("photos", photos)}
      />

      {/* Summary box */}
      <div
        style={{
          marginTop: 24,
          padding: 18,
          background: "rgba(255,255,255,.03)",
          borderRadius: 10,
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          Entry Summary
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {[
            ["Title", form.title],
            ["Category", form.workCategory?.split(" (")[0]],
            ["Location", form.locationDescription],
            [
              "GPS",
              form.gpsLat ? `${form.gpsLat}, ${form.gpsLng}` : "Not captured",
            ],
            ["Line Items", form.lineItems.length],
            [
              "SEM Params",
              `${form.semChecklist.filter((c) => c.passed).length} / ${semParams.length} verified`,
            ],
            ["Photos", form.photos.length],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                background: "rgba(255,255,255,.03)",
                padding: "8px 12px",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 2,
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: k === "Total Value" ? 700 : 400,
                  color: k === "Total Value" ? "var(--accent)" : "var(--text)",
                }}
              >
                {v || "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
