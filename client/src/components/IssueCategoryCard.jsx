export default function IssueCategoryCard({ category, description, icon }) {
  return (
    <div className="glass-card rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-civic-50 to-white text-2xl">
        {icon}
      </div>
      <div className="mt-4 text-sm font-semibold text-slate-900">{category}</div>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
