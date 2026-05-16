import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Lead, CreateLeadDTO } from '@/types';

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadDTO) => Promise<void>;
  loading: boolean;
  lead?: Lead | null;
}

export default function LeadForm({ open, onClose, onSubmit, loading, lead }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLeadDTO>();

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes ?? '',
      });
    } else {
      reset({ name: '', email: '', status: 'New', source: 'Website', notes: '' });
    }
  }, [lead, reset, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md card p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-[var(--text)]">
            {lead ? 'Edit Lead' : 'New Lead'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
              placeholder="Rahul Sharma"
              className="input"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email *</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
              type="email"
              placeholder="lead@company.com"
              className="input"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="label">Source *</label>
              <select
                {...register('source', { required: 'Source is required' })}
                className="input"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
              {errors.source && <p className="text-xs text-red-400 mt-1">{errors.source.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              {...register('notes', { maxLength: { value: 500, message: 'Max 500 characters' } })}
              placeholder="Any additional notes..."
              rows={3}
              className="input resize-none"
            />
            {errors.notes && <p className="text-xs text-red-400 mt-1">{errors.notes.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Saving...</>
              ) : (
                lead ? 'Update Lead' : 'Create Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
