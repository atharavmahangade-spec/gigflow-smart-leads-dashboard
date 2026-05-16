// ─── Auth Types ───────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Lead Types ───────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type SortOrder = 'latest' | 'oldest';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: { _id: string; name: string; email: string } | string;
  assignedTo?: { _id: string; name: string; email: string } | string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDTO {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
}

export interface UpdateLeadDTO extends Partial<CreateLeadDTO> {}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface LeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

// ─── Stats Types ──────────────────────────────────────────────────────────────

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
}
