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
  id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  key: '', label: '', unit: '', type: 'number', options: [], columns: [], fixedNumber: undefined,fixedText: undefined, billingRate: undefined,
  requiresPhoto: false,
});

export const newColumn = () => ({
  id: `col-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  key: '', label: '', unit: '', type: 'text', options: [], columns: [],
});

export const newItem = () => ({
  id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  code: '', label: '', description: '', measurements: [],
});

export const newChapter = (idx) => ({
  id: `ch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '', code: '',
  color: CHAPTER_COLORS[idx % CHAPTER_COLORS.length],
  items: [],
});

export const newProject = () => ({
  id: `proj-${Date.now()}`,
  name: '', code: '', description: '', Vault: { allotedBudjet: 0, spentBudjet: 0, logs: [] },
  status: 'DRAFT',
  chapters: []
});
