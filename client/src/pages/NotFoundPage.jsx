import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="glass-card rounded-[2rem] p-10">
        <div className="text-5xl font-semibold text-slate-900">404</div>
        <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Go Home
        </Link>
      </div>
    </div>
  );
}
