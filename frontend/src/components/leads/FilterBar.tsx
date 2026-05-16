import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { LeadFilters, LeadStatus, LeadSource } from '@/types';

interface FilterBarProps {
  filters: LeadFilters;
  onChange: (filters: Partial<LeadFilters>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function FilterBar({ filters, onChange, searchValue, onSearchChange }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="input pl-9"
        />
      </div>

      {/* Status filter */}
      <div className="relative">
        <SlidersHorizontal size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <select
          value={filters.status ?? ''}
          onChange={(e) => onChange({ status: e.target.value as LeadStatus | '', page: 1 })}
          className="input pl-9 pr-8 min-w-36"
        >
          <option value="">All statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {/* Source filter */}
      <div className="relative">
        <SlidersHorizontal size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <select
          value={filters.source ?? ''}
          onChange={(e) => onChange({ source: e.target.value as LeadSource | '', page: 1 })}
          className="input pl-9 pr-8 min-w-36"
        >
          <option value="">All sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>
      </div>

      {/* Sort */}
      <div className="relative">
        <ArrowUpDown size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <select
          value={filters.sort ?? 'latest'}
          onChange={(e) => onChange({ sort: e.target.value as 'latest' | 'oldest', page: 1 })}
          className="input pl-9 pr-8 min-w-32"
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </div>
  );
}
