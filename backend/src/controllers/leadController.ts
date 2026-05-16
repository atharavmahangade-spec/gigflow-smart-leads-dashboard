import { Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Lead, ILeadDocument } from '../models/Lead';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthRequest, LeadFilters, LeadStatus, LeadSource } from '../types';

// ─── Get All Leads (with filter + search + pagination) ────────────────────────

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query: FilterQuery<ILeadDocument> = {};

    // Role-based: sales users only see their own leads
    if (req.user?.role === 'sales') {
      query.createdBy = req.user.id;
    }

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      query.status = status as LeadStatus;
    }

    if (source && ['Website', 'Instagram', 'Referral'].includes(source)) {
      query.source = source as LeadSource;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .lean(),
      Lead.countDocuments(query),
    ]);

    sendPaginated(res, 'Leads fetched successfully', leads, total, pageNum, limitNum);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch leads';
    sendError(res, message, 500);
  }
};

// ─── Get Single Lead ──────────────────────────────────────────────────────────

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const query: FilterQuery<ILeadDocument> = { _id: id };

    if (req.user?.role === 'sales') {
      query.createdBy = req.user.id;
    }

    const lead = await Lead.findOne(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    sendSuccess(res, 'Lead fetched', lead);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch lead';
    sendError(res, message, 500);
  }
};

// ─── Create Lead ──────────────────────────────────────────────────────────────

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.id,
    });

    const populated = await lead.populate('createdBy', 'name email');
    sendSuccess(res, 'Lead created successfully', populated, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create lead';
    sendError(res, message, 500);
  }
};

// ─── Update Lead ──────────────────────────────────────────────────────────────

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const query: FilterQuery<ILeadDocument> = { _id: id };

    // Sales users can only update their own leads
    if (req.user?.role === 'sales') {
      query.createdBy = req.user.id;
    }

    const lead = await Lead.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found or unauthorized', 404);
      return;
    }

    sendSuccess(res, 'Lead updated successfully', lead);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update lead';
    sendError(res, message, 500);
  }
};

// ─── Delete Lead ──────────────────────────────────────────────────────────────

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const query: FilterQuery<ILeadDocument> = { _id: id };

    // Only admins can delete; sales users can delete their own
    if (req.user?.role === 'sales') {
      query.createdBy = req.user.id;
    }

    const lead = await Lead.findOneAndDelete(query);

    if (!lead) {
      sendError(res, 'Lead not found or unauthorized', 404);
      return;
    }

    sendSuccess(res, 'Lead deleted successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete lead';
    sendError(res, message, 500);
  }
};

// ─── Export Leads as CSV ──────────────────────────────────────────────────────

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: FilterQuery<ILeadDocument> = {};

    if (req.user?.role === 'sales') {
      query.createdBy = req.user.id;
    }

    // Apply same filters as getLeads
    const { status, source, search } = req.query as Record<string, string>;

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      query.status = status as LeadStatus;
    }
    if (source && ['Website', 'Instagram', 'Referral'].includes(source)) {
      query.source = source as LeadSource;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name')
      .lean();

    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created By', 'Created At'];
    const rows = leads.map((lead) => {
      const createdBy = lead.createdBy as unknown as { name: string } | null;
      return [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${lead.notes ?? ''}"`,
        `"${createdBy?.name ?? ''}"`,
        `"${new Date(lead.createdAt).toISOString()}"`,
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csv);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to export leads';
    sendError(res, message, 500);
  }
};

// ─── Dashboard Stats (Admin only) ────────────────────────────────────────────

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: FilterQuery<ILeadDocument> = {};
    if (req.user?.role === 'sales') {
      query.createdBy = req.user.id;
    }

    const [total, byStatus, bySource] = await Promise.all([
      Lead.countDocuments(query),
      Lead.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: query },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
    ]);

    const stats = {
      total,
      byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
      bySource: Object.fromEntries(bySource.map((s) => [s._id, s.count])),
    };

    sendSuccess(res, 'Stats fetched', stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    sendError(res, message, 500);
  }
};

// Re-export for use in routes
export type { LeadFilters };
