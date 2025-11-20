import { body } from 'express-validator';

const exerciseValidators = [
  body('exercises').optional().isArray({ max: 20 }),
  body('exercises.*.name').optional().isString().trim().notEmpty(),
  body('exercises.*.sets').optional().isInt({ min: 0, max: 20 }),
  body('exercises.*.reps').optional().isInt({ min: 0, max: 200 }),
  body('exercises.*.weightKg').optional().isFloat({ min: 0, max: 500 }),
  body('exercises.*.durationMinutes').optional().isInt({ min: 0, max: 300 }),
  body('exercises.*.distanceKm').optional().isFloat({ min: 0, max: 100 }),
  body('exercises.*.notes').optional().isString().trim(),
];

export const createWorkoutValidator = [
  body('title').isString().trim().notEmpty(),
  body('type').isIn(['strength', 'conditioning', 'mobility', 'hybrid', 'endurance']),
  body('date').isISO8601(),
  body('durationMinutes').isInt({ min: 1, max: 600 }),
  body('intensity').optional().isIn(['easy', 'moderate', 'hard']),
  body('perceivedEffort').optional().isInt({ min: 1, max: 10 }),
  body('calories').optional().isInt({ min: 0, max: 5000 }),
  body('notes').optional().isString(),
  body('status').optional().isIn(['planned', 'completed', 'skipped']),
  body('plan').optional().isMongoId(),
  body('sessionId').optional().isMongoId(),
  ...exerciseValidators,
];

export const updateWorkoutValidator = [
  body('title').optional().isString().trim().notEmpty(),
  body('type').optional().isIn(['strength', 'conditioning', 'mobility', 'hybrid', 'endurance']),
  body('date').optional().isISO8601(),
  body('durationMinutes').optional().isInt({ min: 1, max: 600 }),
  body('intensity').optional().isIn(['easy', 'moderate', 'hard']),
  body('perceivedEffort').optional().isInt({ min: 1, max: 10 }),
  body('calories').optional().isInt({ min: 0, max: 5000 }),
  body('notes').optional().isString(),
  body('status').optional().isIn(['planned', 'completed', 'skipped']),
  body('plan').optional().isMongoId(),
  body('sessionId').optional().isMongoId(),
  ...exerciseValidators,
];



