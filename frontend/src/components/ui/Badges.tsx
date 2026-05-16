import { LeadStatus, LeadSource } from '@/types';

const statusConfig: Record<LeadStatus, { label: string; classes: string; dot: string }> = {
  New:       { label: 'New',       classes: 'bg-blue-500/15 text-blue-500',   dot: 'bg-blue-500' },
  Contacted: { label: 'Contacted', classes: 'bg-amber-500/15 text-amber-500', dot: 'bg-amber-500' },
  Qualified: { label: 'Qualified', classes: 'bg-green-500/15 text-green-500', dot: 'bg-green-500' },
  Lost:      { label: 'Lost',      classes: 'bg-red-500/15 text-red-400',     dot: 'bg-red-400' },
};

const sourceConfig: Record<LeadSource, { label: string; classes: string }> = {
  Website:   { label: 'Website',   classes: 'bg-purple-500/15 text-purple-400' },
  Instagram: { label: 'Instagram', classes: 'bg-pink-500/15 text-pink-400' },
  Referral:  { label: 'Referral',  classes: 'bg-teal-500/15 text-teal-400' },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`badge ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function SourceBadge({ source }: { source: LeadSource }) {
  const cfg = sourceConfig[source];
  return (
    <span className={`badge ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}
