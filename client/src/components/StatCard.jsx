export default function StatCard({ label, value, delta }) {
  return (
    <div className="glass-card rounded-3xl p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      <div className="mt-2 text-xs font-medium text-civic-700">{delta}</div>
    </div>
  );
}
