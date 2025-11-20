import { body, param } from 'express-validator';

export const createGoalValidator = [
  body('type')
    .isIn(['workouts', 'minutes', 'steps', 'weight', 'calories'])
    .withMessage('Invalid goal type'),
  body('period').isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid period'),
  body('target').isFloat({ min: 0.1 }).withMessage('Target must be greater than 0'),
  body('unit').optional().isString(),
  body('startDate').optional().isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate(),
];

export const updateGoalValidator = [
  param('id').isMongoId().withMessage('Invalid goal id'),
  body('target').optional().isFloat({ min: 0.1 }),
  body('progress').optional().isFloat({ min: 0 }),
  body('isActive').optional().isBoolean(),
];


