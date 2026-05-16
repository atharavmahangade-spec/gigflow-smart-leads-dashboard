import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, LogOut, Sun, Moon, Zap, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('gigflow-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col
          bg-[var(--bg-card)] border-r border-[var(--border)]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-[var(--text)]">GigFlow</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[var(--border)] space-y-2">
          {/* User card */}
          <div className="px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)]">
            <p className="text-sm font-medium text-[var(--text)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium
              ${user?.role === 'admin'
                ? 'bg-amber-500/15 text-amber-500'
                : 'bg-brand-500/15 text-brand-500 dark:text-brand-400'
              }`}>
              {user?.role}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)] transition-all"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? 'Light mode' : 'Dark mode'}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border)] lg:hidden bg-[var(--bg-card)]">
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--text-muted)]">
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-[var(--text)]">GigFlow</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
