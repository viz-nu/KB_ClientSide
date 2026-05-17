import LineItemCard from "../components/LineItemCard.jsx";

export default function StepLineItems({
  form,
  set,
  addLine,
  removeLine,
  updateLine,
  activeChapter,
}) {
  const handleAddLine = () => addLine(form, set);
  const handleRemoveLine = (id) => removeLine(form, set, id);
  const handleUpdateLine = (id, patch) => updateLine(form, set, id, patch);
  if (form.lineItems.length === 0) addLine(form, set);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <div className="card-title" style={{ marginBottom: 2 }}>
            Line Items
          </div>
          {form.lineItems.length > 0 && (
            <div style={{ fontSize: 11, color: "var(--text3)" }}>
              {form.lineItems.length} item
              {form.lineItems.length !== 1 ? "s" : ""} added
            </div>
          )}
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={handleAddLine}
          style={{
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 600,
            minHeight: 40,
          }}
        >
          + Add Item
        </button>
      </div>
      <LineItemCard
        form={form}
        set={set}
        updateLine={handleUpdateLine}
        removeLine={handleRemoveLine}
        activeChapter={activeChapter}
      />
    </div>
  );
}
