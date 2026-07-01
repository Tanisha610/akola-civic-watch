import { useMemo, useState } from 'react';
import { wards } from '../data/wards';

export default function WardCheckPage() {
  const [query, setQuery] = useState('');

  const filteredWards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return wards;

    return wards.filter((ward) => `${ward.number} ${ward.name}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="space-y-6 pb-10">
      <section className="glass-card rounded-[2rem] p-6 md:p-8">
        <span className="chip bg-civic-100 text-civic-800">Ward finder</span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">Check your Ward</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
          Search the Akola municipal wards below to find your area before reporting an issue.
        </p>
        <input
          className="input-field mt-6 max-w-xl"
          placeholder="Search ward number or area name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredWards.map((ward) => (
          <article key={ward.number} className="glass-card rounded-3xl p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-civic-700">Ward {String(ward.number).padStart(2, '0')}</div>
            <div className="mt-3 text-lg font-semibold text-slate-900">{ward.name}</div>
          </article>
        ))}
      </section>
    </div>
  );
}