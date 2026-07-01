import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

export default function LoginPage() {
  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await loginWithCredentials({ name, email, password, mode });
      toast.success(mode === 'register' ? 'Account created.' : 'Signed in successfully.');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-50 via-white to-orange-50 px-4 py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-soft backdrop-blur md:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-[#173f39] p-8 text-white md:p-10">
          <Link to="/" className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
            Back to home
          </Link>
          <div className="mt-8">
            <BrandLogo />
          </div>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight">Sign in to report and manage civic issues.</h1>
          <p className="mt-4 max-w-md text-sm text-slate-300">Use email and password to enter the citizen or admin workspace.</p>
        </div>
        <div className="p-8 md:p-10">
          <div className="space-y-5">
            <div className="flex rounded-2xl bg-slate-100 p-1 text-sm font-medium">
              <button type="button" className={`flex-1 rounded-xl px-4 py-2 ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`} onClick={() => setMode('login')}>
                Sign in
              </button>
              <button type="button" className={`flex-1 rounded-xl px-4 py-2 ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`} onClick={() => setMode('register')}>
                Create account
              </button>
            </div>
            <form className="space-y-4 rounded-3xl border border-slate-200 p-5" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <input className="input-field" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              )}
              <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="btn-primary w-full" type="submit" disabled={loading}>
                {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Sign in'}
              </button>
            </form>
            <p className="text-xs text-slate-500">
              Firebase login is disabled for now. Email/password auth uses the local backend and MongoDB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
