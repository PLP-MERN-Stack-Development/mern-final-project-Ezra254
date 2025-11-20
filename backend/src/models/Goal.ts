import mongoose, { Document, Schema, Types } from 'mongoose';

export type GoalType = 'workouts' | 'minutes' | 'steps' | 'weight' | 'calories';
export type GoalPeriod = 'daily' | 'weekly' | 'monthly';

export interface IGoal extends Document {
  user: Types.ObjectId;
  type: GoalType;
  period: GoalPeriod;
  target: number;
  progress: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['workouts', 'minutes', 'steps', 'weight', 'calories'], required: true },
    period: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    target: { type: Number, required: true, min: 0 },
    progress: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: 'sessions' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, type: 1, period: 1, startDate: -1 });
goalSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const transformed = ret as typeof ret & { id?: string };
    transformed.id = transformed._id.toString();
    Reflect.deleteProperty(transformed, '_id');
    return transformed;
  },
});

export const Goal = mongoose.model<IGoal>('Goal', goalSchema);


