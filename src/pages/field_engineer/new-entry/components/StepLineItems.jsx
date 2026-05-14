import { EmptyState } from "../../../../components/common/index.jsx";
import LineItemCard from "../components/LineItemCard.jsx";

export default function StepLineItems({ form, set, addLine, removeLine, updateLine, activeChapter }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div className="card-title" style={{ marginBottom: 2 }}>Line Items</div>
          {form.lineItems.length > 0 && (
            <div style={{ fontSize: 11, color: "var(--text3)" }}>{form.lineItems.length} item{form.lineItems.length !== 1 ? "s" : ""} added</div>
          )}
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={addLine}
          style={{ padding: "8px 14px", fontSize: 13, fontWeight: 600, minHeight: 40 }}
        >
          + Add Item
        </button>
      </div>

      {form.lineItems.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No line items yet"
          message="Tap '+ Add Item' to start recording measurements."
          action={
            <button className="btn btn-primary btn-sm" onClick={addLine} style={{ minHeight: 44, padding: "10px 20px" }}>
              + Add First Item
            </button>
          }
        />
      ) : (
        <LineItemCard
          form={form}
          set={set}
          updateLine={updateLine}
          removeLine={removeLine}
          activeChapter={activeChapter}
        />
      )}
    </div>
  );
}