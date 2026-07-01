import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const items = [
  { to: '/', label: 'Overview' },
  { to: '/map', label: 'Interactive Map' },
  { to: '/ward-check', label: 'Check your Ward' },
  { to: '/report', label: 'Report Issue' },
  { to: '/dashboard', label: 'Citizen Dashboard' }
];

export default function Sidebar() {
  return (
    <aside className="sticky top-24 hidden h-fit w-64 shrink-0 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur md:block">
      <div className="mb-4 rounded-2xl bg-civic-50 p-4">
        <p className="text-sm font-semibold text-civic-800">City Pulse</p>
        <p className="mt-1 text-xs text-slate-600">Check your ward, track reports, and follow service response.</p>
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'block rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive ? 'bg-civic-700 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-civic-700'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
