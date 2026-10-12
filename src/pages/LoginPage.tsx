import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input } from '@/components/ui';
import { DEMO_ACCOUNTS } from '@/data/seed';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
            BE
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">BIZ EXCHANGE</p>
            <p className="text-[10px] text-slate-400 leading-tight">AI-Powered B2B Platform</p>
          </div>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Welcome back to the<br />exchange.
          </h1>
          <p className="mt-4 text-slate-300 leading-relaxed max-w-md">
            Sign in to manage your listings, discover AI-powered matches, and handle
            exchange requests with businesses across Tamil Nadu.
          </p>
        </div>

        <p className="text-xs text-slate-500">
          MCA College Mini Project &middot; Coimbatore, Tamil Nadu
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to access the exchange.</p>

          {/* Demo accounts */}
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-800">Quick Demo Login</p>
            </div>
            <p className="text-xs text-emerald-700 mb-3">Click any account below to sign in instantly.</p>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleDemoLogin(acc.email, acc.password)}
                  disabled={loading}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all text-left disabled:opacity-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{acc.label}</p>
                    <p className="text-xs text-slate-500">{acc.businessName}</p>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">Login &rarr;</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-700">
              Register your business
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-slate-400">
            Demo authentication for educational purposes. Not production-secure.
          </p>
        </div>
      </div>
    </div>
  );
}
