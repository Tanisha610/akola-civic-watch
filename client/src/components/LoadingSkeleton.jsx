export default function LoadingSkeleton({ lines = 3 }) {
  return (
    <div className="glass-card space-y-3 rounded-3xl p-5">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-4 animate-pulse rounded-full bg-slate-200" />
      ))}
    </div>
  );
}
