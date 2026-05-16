import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Download, Trash2, Pencil, Eye, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsApi } from '@/api/leads';
import { LeadFilters, Lead, CreateLeadDTO } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/store/authStore';
import FilterBar from '@/components/leads/FilterBar';
import LeadForm from '@/components/leads/LeadForm';
import Pagination from '@/components/ui/Pagination';
import { StatusBadge, SourceBadge } from '@/components/ui/Badges';

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [filters, setFilters] = useState<LeadFilters>({ page: 1, limit: 10, sort: 'latest' });
  const [searchInput, setSearchInput] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);

  const queryFilters: LeadFilters = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['leads', queryFilters],
    queryFn: () => leadsApi.getAll(queryFilters),
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: leadsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      setFormOpen(false);
      toast.success('Lead created!');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create lead');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateLeadDTO }) =>
      leadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      setFormOpen(false);
      setEditLead(null);
      toast.success('Lead updated!');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update lead');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: leadsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      setDeleteId(null);
      toast.success('Lead deleted');
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  const handleFilterChange = useCallback((updated: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  }, []);

  const handleFormSubmit = async (formData: CreateLeadDTO) => {
    if (editLead) {
      await updateMutation.mutateAsync({ id: editLead._id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await leadsApi.exportCSV({ ...filters, search: debouncedSearch || undefined });
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditLead(null);
    setFormOpen(true);
  };

  const leads = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text)]">Leads</h1>
          <p className="text-[var(--text-muted)] mt-0.5 text-sm">
            {pagination ? `${pagination.total} total leads` : 'Manage your pipeline'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="btn-ghost"
          >
            {exportLoading
              ? <Loader2 size={15} className="animate-spin" />
              : <Download size={15} />
            }
            Export CSV
          </button>
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} />
            New Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        searchValue={searchInput}
        onSearchChange={(v) => {
          setSearchInput(v);
          setFilters((f) => ({ ...f, page: 1 }));
        }}
      />

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="font-medium">No leads found</p>
            <p className="text-sm mt-1">
              {debouncedSearch || filters.status || filters.source
                ? 'Try adjusting your filters'
                : 'Add your first lead to get started'}
            </p>
            {!debouncedSearch && !filters.status && !filters.source && (
              <button onClick={openCreate} className="btn-primary mt-4">
                <Plus size={15} /> Add Lead
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y divide-[var(--border)] transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-[var(--bg-subtle)] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-500/15 text-brand-500 dark:text-brand-400 flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-[var(--text)] text-sm">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{lead.email}</td>
                      <td className="px-5 py-4"><StatusBadge status={lead.status} /></td>
                      <td className="px-5 py-4"><SourceBadge source={lead.source} /></td>
                      <td className="px-5 py-4 text-sm text-[var(--text-muted)]">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/leads/${lead._id}`} className="btn-ghost px-2 py-2" title="View">
                            <Eye size={15} />
                          </Link>
                          <button onClick={() => openEdit(lead)} className="btn-ghost px-2 py-2" title="Edit">
                            <Pencil size={15} />
                          </button>
                          {(user?.role === 'admin' || (typeof lead.createdBy === 'object' && lead.createdBy?._id === user?._id)) && (
                            <button
                              onClick={() => setDeleteId(lead._id)}
                              className="btn-danger px-2 py-2"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[var(--border)]">
              {leads.map((lead) => (
                <div key={lead._id} className="p-4 hover:bg-[var(--bg-subtle)] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-500/15 text-brand-500 dark:text-brand-400 flex items-center justify-center font-display font-bold flex-shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--text)] text-sm">{lead.name}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{lead.email}</p>
                      <div className="flex gap-2 mt-2">
                        <StatusBadge status={lead.status} />
                        <SourceBadge source={lead.source} />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Link to={`/leads/${lead._id}`} className="btn-ghost px-2 py-2">
                        <Eye size={15} />
                      </Link>
                      <button onClick={() => openEdit(lead)} className="btn-ghost px-2 py-2">
                        <Pencil size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="px-5 py-4 border-t border-[var(--border)]">
                <Pagination
                  meta={pagination}
                  onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Lead Form Modal */}
      <LeadForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditLead(null); }}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        lead={editLead}
      />

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative card p-6 w-full max-w-sm shadow-2xl animate-slide-up">
            <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">Delete Lead?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              This action cannot be undone. The lead will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center">
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-all disabled:opacity-50"
              >
                {deleteMutation.isPending
                  ? <><Loader2 size={14} className="animate-spin" /> Deleting...</>
                  : <><Trash2 size={14} /> Delete</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
