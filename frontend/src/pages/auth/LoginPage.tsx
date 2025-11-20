import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login(form);
      navigate('/');
    } catch {
      // handled by store
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Sign in</h2>
        <p className="text-sm text-slate-500">Track workouts, meals, and insights</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="********"
            required
            minLength={8}
          />
        </div>
      </div>
      {error && <p className="rounded-2xl bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-400"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
      <p className="text-center text-sm text-slate-500">
        No account?{' '}
        <Link className="text-primary-600 hover:underline" to="/register">
          Create one
        </Link>
      </p>
    </form>
  );
};

export default LoginPage;

