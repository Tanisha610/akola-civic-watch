const statusTone = {
  Reported: 'bg-amber-100 text-amber-800',
  'Under Review': 'bg-sky-100 text-sky-800',
  'In Progress': 'bg-civic-100 text-civic-800',
  Resolved: 'bg-emerald-100 text-emerald-800'
};

export default function StatusBadge({ status }) {
  return <span className={`chip ${statusTone[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}
