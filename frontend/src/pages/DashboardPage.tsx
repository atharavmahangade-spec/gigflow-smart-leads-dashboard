import { useQuery } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads';
import { useAuthStore } from '@/store/authStore';
import { Users, TrendingUp, Target, AlertCircle, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LeadStatus, LeadSource } from '@/types';

const statusColors: Record<LeadStatus, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-amber-500',
  Qualified: 'bg-green-500',
  Lost: 'bg-red-400',
};

const sourceColors: Record<LeadSource, string> = {
  Website: 'bg-purple-500',
  Instagram: 'bg-pink-500',
  Referral: 'bg-teal-500',
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: leadsApi.getStats,
  });

  const { data: recentLeads } = useQuery({
    queryKey: ['leads-recent'],
    queryFn: () => leadsApi.getAll({ limit: 5, sort: 'latest' }),
  });

  const statCards = [
    {
      label: 'Total Leads',
      value: stats?.total ?? 0,
      icon: Users,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      label: 'Qualified',
      value: stats?.byStatus?.Qualified ?? 0,
      icon: Target,
      color: 'text-green-500 bg-green-500/10',
    },
    {
      label: 'Contacted',
      value: stats?.byStatus?.Contacted ?? 0,
      icon: TrendingUp,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      label: 'Lost',
      value: stats?.byStatus?.Lost ?? 0,
      icon: AlertCircle,
      color: 'text-red-400 bg-red-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center">
            <Zap size={12} className="text-white" />
          </div>
          <p className="text-sm text-[var(--text-muted)] font-medium">Overview</p>
        </div>
        <h1 className="font-display font-bold text-3xl text-[var(--text)]">
          Good to see you, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-[var(--text-muted)] mt-1">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-5 animate-slide-up">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <Icon size={20} />
              </div>
              {isLoading ? (
                <div className="h-8 w-16 bg-[var(--bg-subtle)] rounded-lg animate-pulse" />
              ) : (
                <p className="font-display font-bold text-3xl text-[var(--text)]">{card.value}</p>
              )}
              <p className="text-sm text-[var(--text-muted)] mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-[var(--text)] mb-5">By Status</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-[var(--bg-subtle)] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats && stats.total > 0 ? (
            <div className="space-y-3">
              {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((status) => {
                const count = stats.byStatus?.[status] ?? 0;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[var(--text-muted)]">{status}</span>
                      <span className="text-sm font-medium text-[var(--text)]">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${statusColors[status]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--text-muted)] text-sm">No leads yet</p>
          )}
        </div>

        {/* Source breakdown */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-[var(--text)] mb-5">By Source</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-[var(--bg-subtle)] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats && stats.total > 0 ? (
            <div className="space-y-3">
              {(['Website', 'Instagram', 'Referral'] as LeadSource[]).map((source) => {
                const count = stats.bySource?.[source] ?? 0;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={source}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[var(--text-muted)]">{source}</span>
                      <span className="text-sm font-medium text-[var(--text)]">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${sourceColors[source]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--text-muted)] text-sm">No leads yet</p>
          )}
        </div>
      </div>

      {/* Recent leads */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-[var(--text)]">Recent Leads</h3>
          <Link to="/leads" className="btn-ghost text-brand-500 dark:text-brand-400 gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {!recentLeads?.data?.length ? (
          <div className="text-center py-10 text-[var(--text-muted)]">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No leads yet. <Link to="/leads" className="text-brand-500 hover:underline">Add your first lead →</Link></p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLeads.data.map((lead) => (
              <Link
                key={lead._id}
                to={`/leads/${lead._id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-subtle)] transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-brand-500/15 text-brand-500 dark:text-brand-400 flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{lead.name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{lead.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <ArrowRight size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
