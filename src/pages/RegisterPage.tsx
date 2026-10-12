import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Select } from '@/components/ui';
import { BUSINESS_TYPES, LOCATIONS } from '@/types';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    businessType: '' as string,
    location: '' as string,
    contactNumber: '',
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (form.contactNumber.length < 10) {
      setError('Contact number must be at least 10 digits');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        businessName: form.businessName,
        businessType: form.businessType as import('@/types').BusinessType,
        location: form.location,
        contactNumber: form.contactNumber,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
            BE
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">BIZ EXCHANGE</p>
            <p className="text-[10px] text-slate-400 leading-tight">AI-Powered B2B Platform</p>
          </div>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Join the local B2B<br />exchange.
          </h1>
          <p className="mt-4 text-slate-300 leading-relaxed max-w-md">
            Register your business to start posting what you NEED and what you HAVE.
            Our AI matching engine will connect you with the right partners.
          </p>
          <div className="mt-8 space-y-3">
            {[
              'Post unlimited NEED and HAVE listings',
              'Get AI-powered semantic match recommendations',
              'Send and receive exchange requests',
              'Track all activity from your dashboard',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {item}
              </div>
            ))}
          </div>
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

          <h2 className="text-2xl font-bold text-slate-900">Register your business</h2>
          <p className="mt-2 text-sm text-slate-500">Create an account to join the exchange.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Input label="Full Name" name="fullName" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Your full name" required />
            <Input label="Email" type="email" name="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@business.com" required />
            <Input label="Password" type="password" name="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="At least 6 characters" required />
            <Input label="Business Name" name="businessName" value={form.businessName} onChange={(e) => update('businessName', e.target.value)} placeholder="Your business name" required />
            <Select label="Business Type" name="businessType" value={form.businessType} onChange={(e) => update('businessType', e.target.value)} required>
              <option value="">Select business type</option>
              {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select label="City / Location" name="location" value={form.location} onChange={(e) => update('location', e.target.value)} required>
              <option value="">Select your city</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
            <Input label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={(e) => update('contactNumber', e.target.value)} placeholder="10-digit mobile number" required />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
