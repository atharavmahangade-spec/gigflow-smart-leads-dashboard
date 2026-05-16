import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const result = await authApi.login(data);
      setAuth(result.user, result.token);
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-slide-up">
        {/* Card */}
        <div className="card p-8 shadow-2xl shadow-black/10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-[var(--text)]">GigFlow</h1>
              <p className="text-xs text-[var(--text-muted)]">Smart Leads Dashboard</p>
            </div>
          </div>

          <h2 className="font-display font-bold text-2xl text-[var(--text)] mb-1">Welcome back</h2>
          <p className="text-sm text-[var(--text-muted)] mb-8">Sign in to manage your leads</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
                type="email"
                placeholder="you@company.com"
                className="input"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 dark:text-brand-400 font-medium hover:underline">
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] font-medium mb-1">Demo credentials</p>
            <p className="text-xs text-[var(--text-muted)] font-mono">admin@gigflow.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
