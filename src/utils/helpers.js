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
export const STRIP_KEYS = new Set([
  '_id',
  '__typename',
  'localId',
  'createdAt',
  'updatedAt',
  'cumulativeProgress',
]);