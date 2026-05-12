export const FIELD_TYPES = [
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'multiselect', label: 'Multi-select', icon: '☑️' },
  { value: 'boolean', label: 'Yes / No', icon: '✅' },
  { value: 'table', label: 'Table (rows)', icon: '📊' },
  { value: 'time', label: 'Time', icon: '🕒' },
  { value: 'phone', label: 'Phone Number', icon: '📞' },
];

export const CHAPTER_COLORS = [
  '#3B82F6', '#22C55E', '#EAB308', '#D946EF',
  '#F97316', '#14B8A6', '#6366F1', '#EF4444', '#A855F7', '#EC4899',
];

export const newMeasurement = () => ({
  _id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  key: '', label: '', unit: '', type: 'number', options: [], columns: [], fixedNumber: undefined, fixedText: undefined, billingRate: undefined,
  requiresPhoto: false,
});

export const newColumn = () => ({
  _id: `col-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  key: '', label: '', unit: '', type: 'text', options: [], columns: [],
});

export const newItem = () => ({
  _id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  code: '', label: '', description: '', measurements: [],
});

export const newChapter = () => ({
  _id: `ch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '', code: '',
  color: CHAPTER_COLORS[Math.floor(Math.random() * CHAPTER_COLORS.length)],
  items: [],
});

export const newProject = () => ({
  _id: `proj-${Date.now()}`,
  name: '', code: '', description: '', Vault: { allotedBudjet: 0, spentBudjet: 0, logs: [] },
  status: 'DRAFT',
  chapters: []
});


// chapters
export const addChapter = (setProj, setActCh, setActItem) => {
  const ch = newChapter();
  setProj((p) => ({ ...p, chapters: [...p.chapters, ch] }));
  setActCh(ch._id);
  setActItem(null);
};
export const updateChapter = (setProj, _id, k, v) =>
  setProj((p) => ({
    ...p,
    chapters: p.chapters.map((c) => (c._id === _id ? { ...c, [k]: v } : c)),
  }));
export const deleteChapter = (setProj, setActCh, setActItem, _id) => {
  setProj((p) => ({ ...p, chapters: p.chapters.filter((c) => c._id !== _id) }));
  setActCh(null);
  setActItem(null);
};
export const moveChapter = (setProj, _id, dir) =>
  setProj((p) => {
    const a = [...p.chapters];
    const i = a.findIndex((c) => c._id === _id);
    const t = i + dir;
    if (t < 0 || t >= a.length) return p;
    [a[i], a[t]] = [a[t], a[i]];
    return { ...p, chapters: a };
  });

// items
export const addItem = (setProj, setActItem, chId) => {
  const item = newItem();
  setProj((p) => ({
    ...p,
    chapters: p.chapters.map((c) =>
      c._id === chId ? { ...c, items: [...c.items, item] } : c,
    ),
  }));
  setActItem(item._id);
};
export const updateItem = (setProj, chId, iId, k, v) =>
  setProj((p) => ({
    ...p,
    chapters: p.chapters.map((c) =>
      c._id === chId
        ? {
          ...c,
          items: c.items.map((i) => (i._id === iId ? { ...i, [k]: v } : i)),
        }
        : c,
    ),
  }));
export const deleteItem = (setProj, setActItem, chId, iId) => {
  setProj((p) => ({
    ...p,
    chapters: p.chapters.map((c) =>
      c._id === chId
        ? { ...c, items: c.items.filter((i) => i._id !== iId) }
        : c,
    ),
  }));
  setActItem(null);
};
export const moveItem = (setProj, chId, iId, dir) =>
  setProj((p) => ({
    ...p,
    chapters: p.chapters.map((c) => {
      if (c._id !== chId) return c;
      const a = [...c.items];
      const i = a.findIndex((x) => x._id === iId);
      const t = i + dir;
      if (t < 0 || t >= a.length) return c;
      [a[i], a[t]] = [a[t], a[i]];
      return { ...c, items: a };
    }),
  }));

// measurements
export const addMeasurement = (setProj, chId, iId) => {
  const m = newMeasurement();
  setProj((p) => ({
    ...p,
    chapters: p.chapters.map((c) =>
      c._id === chId
        ? {
          ...c,
          items: c.items.map((i) =>
            i._id === iId
              ? { ...i, measurements: [...i.measurements, m] }
              : i,
          ),
        }
        : c,
    ),
  }));
};
export const updateMeasurement = (setProj, chId, iId, mId, k, v) =>
  setProj((p) => ({
    ...p,
    chapters: p.chapters.map((c) =>
      c._id === chId
        ? {
          ...c,
          items: c.items.map((i) =>
            i._id === iId
              ? {
                ...i,
                measurements: i.measurements.map((m) =>
                  m._id === mId ? { ...m, [k]: v } : m,
                ),
              }
              : i,
          ),
        }
        : c,
    ),
  }));
export const deleteMeasurement = (setProj, chId, iId, mId) =>
  setProj((p) => ({
    ...p,
    chapters: p.chapters.map((c) =>
      c._id === chId
        ? {
          ...c,
          items: c.items.map((i) =>
            i._id === iId
              ? {
                ...i,
                measurements: i.measurements.filter((m) => m._id !== mId),
              }
              : i,
          ),
        }
        : c,
    ),
  }));
export const moveMeasurement = (setProj, chId, iId, mId, dir) =>
  setProj((p) => ({
    ...p,
    chapters: p.chapters.map((c) =>
      c._id !== chId
        ? c
        : {
          ...c,
          items: c.items.map((i) => {
            if (i._id !== iId) return i;
            const a = [...i.measurements];
            const idx = a.findIndex((m) => m._id === mId);
            const t = idx + dir;
            if (t < 0 || t >= a.length) return i;
            [a[idx], a[t]] = [a[t], a[idx]];
            return { ...i, measurements: a };
          }),
        },
    ),
  }));

const STRIP_KEYS = new Set([
  '_id',
  '__typename',
  'localId',
  'createdAt',
  'updatedAt',
  'cumulativeProgress',
]);
export function deepClean(value) {
  if (Array.isArray(value)) {
    return value.map(deepClean);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !STRIP_KEYS.has(k))
        .map(([k, v]) => [k, deepClean(v)])
    );
  }
  return value; // primitive — keep as-is
}