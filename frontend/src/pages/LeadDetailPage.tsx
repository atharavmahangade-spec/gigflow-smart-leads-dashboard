import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Pencil, Trash2, Loader2, User, Mail, Calendar, Tag, Globe } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { leadsApi } from '@/api/leads';
import { useAuthStore } from '@/store/authStore';
import { StatusBadge, SourceBadge } from '@/components/ui/Badges';
import LeadForm from '@/components/leads/LeadForm';
import { CreateLeadDTO, Lead } from '@/types';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateLeadDTO) => leadsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setEditOpen(false);
      toast.success('Lead updated!');
    },
    onError: () => toast.error('Failed to update lead'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => leadsApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted');
      navigate('/leads');
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--text-muted)]">Lead not found.</p>
        <Link to="/leads" className="btn-primary mt-4 inline-flex">Back to Leads</Link>
      </div>
    );
  }

  const createdBy = typeof lead.createdBy === 'object' ? lead.createdBy : null;
  const canDelete = user?.role === 'admin' || createdBy?._id === user?._id;

  const details = [
    { icon: User, label: 'Name', value: lead.name },
    { icon: Mail, label: 'Email', value: lead.email },
    { icon: Globe, label: 'Source', value: <SourceBadge source={lead.source} /> },
    { icon: Tag, label: 'Status', value: <StatusBadge status={lead.status} /> },
    {
      icon: Calendar,
      label: 'Created',
      value: new Date(lead.createdAt).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }),
    },
    { icon: User, label: 'Added by', value: createdBy?.name ?? 'Unknown' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <Link to="/leads" className="btn-ghost inline-flex gap-1">
        <ArrowLeft size={16} /> Back to Leads
      </Link>

      {/* Card */}
      <div className="card p-8">
        {/* Avatar + header */}
        <div className="flex items-start gap-5 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/15 text-brand-500 dark:text-brand-400 flex items-center justify-center font-display font-bold text-2xl flex-shrink-0">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-2xl text-[var(--text)]">{lead.name}</h1>
            <p className="text-[var(--text-muted)] mt-0.5">{lead.email}</p>
            <div className="flex gap-2 mt-3">
              <StatusBadge status={lead.status} />
              <SourceBadge source={lead.source} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={() => setEditOpen(true)} className="btn-ghost">
              <Pencil size={15} /> Edit
            </button>
            {canDelete && (
              <button onClick={() => setConfirmDelete(true)} className="btn-danger">
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Details grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-4 rounded-xl bg-[var(--bg-subtle)]">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className="text-[var(--text-muted)]" />
                <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">{label}</p>
              </div>
              <div className="text-sm text-[var(--text)] font-medium">{value}</div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="mt-4 p-4 rounded-xl bg-[var(--bg-subtle)]">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-[var(--text)] whitespace-pre-line">{lead.notes}</p>
          </div>
        )}
      </div>

      {/* Edit modal */}
       <LeadForm
  open={editOpen}
  onClose={() => setEditOpen(false)}
  onSubmit={async (data: CreateLeadDTO) => {
    await updateMutation.mutateAsync(data);
  }}
  loading={updateMutation.isPending}
  lead={lead as Lead}
/>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative card p-6 w-full max-w-sm shadow-2xl animate-slide-up">
            <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">Delete Lead?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              This will permanently remove <strong>{lead.name}</strong> from your pipeline.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="btn-ghost flex-1 justify-center">
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
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
