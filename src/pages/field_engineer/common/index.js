export const addLine = (form, set) =>
  set("lineItems", [
    ...form.lineItems,
    {
      _id: `li-${Date.now()}`,
      label: "",
      code: "",
      description: "",
      measurements: [],
      remarks: "",
    },
  ]);

export const removeLine = (form, set, id) =>
  set(
    "lineItems",
    form.lineItems.filter((li) => li._id === id),
  );

export const updateLine = (form, set, id, lineItem) => {
  const existing = form.lineItems.find((li) => li._id === id);
  if (!existing) return;
  set(
    "lineItems",
    form.lineItems.map((li) =>
      li._id === id ? { ...existing, ...lineItem } : li,
    ),
  );
};