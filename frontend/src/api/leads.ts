import api from './axios';
import { Lead, CreateLeadDTO, UpdateLeadDTO, LeadFilters, PaginatedResponse, ApiResponse, LeadStats } from '@/types';

export const leadsApi = {
  getAll: async (filters: LeadFilters = {}): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
    const { data } = await api.get<PaginatedResponse<Lead>>(`/leads?${params}`);
    return data;
  },

  getById: async (id: string): Promise<Lead> => {
    const { data } = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    if (!data.data) throw new Error('Lead not found');
    return data.data;
  },

  create: async (payload: CreateLeadDTO): Promise<Lead> => {
    const { data } = await api.post<ApiResponse<Lead>>('/leads', payload);
    if (!data.data) throw new Error('Failed to create lead');
    return data.data;
  },

  update: async (id: string, payload: UpdateLeadDTO): Promise<Lead> => {
    const { data } = await api.put<ApiResponse<Lead>>(`/leads/${id}`, payload);
    if (!data.data) throw new Error('Failed to update lead');
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<LeadStats> => {
    const { data } = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    if (!data.data) throw new Error('Failed to fetch stats');
    return data.data;
  },

  exportCSV: async (filters: Omit<LeadFilters, 'page' | 'limit'> = {}): Promise<void> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value));
    });

    const response = await api.get(`/leads/export/csv?${params}`, {
      responseType: 'blob',
    });

    const url = URL.createObjectURL(new Blob([response.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
