import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch {
      //
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Create account</h2>
        <p className="text-sm text-slate-500">
          Personalize VitalTrack with your wellness preferences.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">First name</label>
          <input
            value={form.firstName}
            onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>
        <div className="sm:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Last name</label>
          <input
            value={form.lastName}
            onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={form.password}
            minLength={8}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>
      </div>
      {error && <p className="rounded-2xl bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-400"
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="text-primary-600 hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;

