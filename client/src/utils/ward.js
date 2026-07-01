export function formatWardLabel(ward) {
  if (ward === null || ward === undefined || ward === '') return '';

  const text = String(ward).trim();
  if (!text) return '';
  if (/^ward\s+/i.test(text)) return text;
  return `Ward ${text}`;
}
