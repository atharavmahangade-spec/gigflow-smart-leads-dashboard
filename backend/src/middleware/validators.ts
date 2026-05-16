import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';
import { sendError } from '../utils/response';

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    sendError(res, 'Validation failed', 422, messages);
    return;
  }
  next();
};

// ─── Auth Validators ──────────────────────────────────────────────────────────

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'sales']).withMessage('Role must be admin or sales'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ─── Lead Validators ──────────────────────────────────────────────────────────

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Lead name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

export const updateLeadValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];
