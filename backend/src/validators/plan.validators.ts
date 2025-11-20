import { body } from 'express-validator';

const sessionValidators = [
  body('sessions').optional().isArray({ max: 14 }).withMessage('Sessions must be an array with at most 14 entries'),
  body('sessions.*.day').optional().isString().trim().notEmpty(),
  body('sessions.*.title').optional().isString().trim().notEmpty(),
  body('sessions.*.notes').optional().isString().trim(),
  body('sessions.*.targetDuration').optional().isInt({ min: 0, max: 300 }),
  body('sessions.*.focusArea').optional().isString().trim(),
  body('sessions.*.status').optional().isIn(['planned', 'completed', 'skipped']),
];

export const createPlanValidator = [
  body('name').isString().trim().notEmpty(),
  body('goal').isString().trim().notEmpty(),
  body('focusArea').isString().trim().notEmpty(),
  body('status').optional().isIn(['draft', 'active', 'paused', 'completed']),
  body('intensity').optional().isIn(['low', 'moderate', 'high']),
  body('startDate').isISO8601(),
  body('endDate').optional().isISO8601(),
  body('notes').optional().isString(),
  ...sessionValidators,
];

export const updatePlanValidator = [
  body('name').optional().isString().trim().notEmpty(),
  body('goal').optional().isString().trim().notEmpty(),
  body('focusArea').optional().isString().trim().notEmpty(),
  body('status').optional().isIn(['draft', 'active', 'paused', 'completed']),
  body('intensity').optional().isIn(['low', 'moderate', 'high']),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('notes').optional().isString(),
  ...sessionValidators,
];



