import { useQuery } from "@apollo/client";
import { SPAN_QUERIES } from "../../../../apollo/gql.js";
import { EmptyState } from "../../../../components/common/index.jsx";
import LineItemCard from "../components/LineItemCard.jsx";
export default function StepLineItems({ form, set, addLine,removeLine,updateLine, activeChapter }) {
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
        <div className="card-title">Line Items</div>
        <button className="btn btn-outline btn-sm" onClick={addLine}>
          + Add Line Item
        </button>
      </div>
      {form.lineItems.length === 0 && (
        <EmptyState
          icon="📋"
          title="No line items"
          message="Click '+ Add Line Item' to start adding measurement entries."
          action={
            <button className="btn btn-primary btn-sm" onClick={addLine}>
              {" "}
              + Add First Item{" "}
            </button>
          }
        />
      )}
      <LineItemCard form={form} set={set} updateLine={updateLine} removeLine={removeLine} activeChapter={activeChapter}/>
    </div>
  );
}
