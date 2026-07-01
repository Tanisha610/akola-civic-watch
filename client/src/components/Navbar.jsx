import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-civic-700 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-civic-700'}`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo compact />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/map" className={navLinkClass}>
            Map
          </NavLink>
          <NavLink to="/report" className={navLinkClass}>
            Report Issue
          </NavLink>
          <NavLink to="/ward-check" className={navLinkClass}>
            Check your Ward
          </NavLink>
          {user?.role && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          {user ? (
            <>
              <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 md:block">
                {user.name}
              </div>
              <button className="btn-secondary px-4 py-2" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn-primary px-4 py-2" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
