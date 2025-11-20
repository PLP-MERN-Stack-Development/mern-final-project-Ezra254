import mongoose, { Document, Schema, Types } from 'mongoose';

export type WorkoutType = 'strength' | 'conditioning' | 'mobility' | 'hybrid' | 'endurance';
export type WorkoutIntensity = 'easy' | 'moderate' | 'hard';
export type WorkoutStatus = 'planned' | 'completed' | 'skipped';

export interface IExerciseEntry {
  name: string;
  sets?: number;
  reps?: number;
  weightKg?: number;
  durationMinutes?: number;
  distanceKm?: number;
  notes?: string;
}

export interface IWorkout extends Document {
  user: Types.ObjectId;
  plan?: Types.ObjectId;
  sessionId?: Types.ObjectId;
  title: string;
  type: WorkoutType;
  date: Date;
  durationMinutes: number;
  intensity: WorkoutIntensity;
  perceivedEffort?: number;
  calories?: number;
  notes?: string;
  status: WorkoutStatus;
  exercises: IExerciseEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema<IExerciseEntry>(
  {
    name: { type: String, required: true },
    sets: Number,
    reps: Number,
    weightKg: Number,
    durationMinutes: Number,
    distanceKm: Number,
    notes: String,
  },
  { _id: false }
);

const workoutSchema = new Schema<IWorkout>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: { type: Schema.Types.ObjectId, ref: 'Plan' },
    sessionId: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    type: { type: String, enum: ['strength', 'conditioning', 'mobility', 'hybrid', 'endurance'], required: true },
    date: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    intensity: { type: String, enum: ['easy', 'moderate', 'hard'], default: 'moderate' },
    perceivedEffort: { type: Number, min: 1, max: 10 },
    calories: { type: Number, min: 0 },
    notes: String,
    status: { type: String, enum: ['planned', 'completed', 'skipped'], default: 'completed' },
    exercises: { type: [exerciseSchema], default: [] },
  },
  { timestamps: true }
);

workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, plan: 1 });
workoutSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const transformed = ret as typeof ret & { id?: string };
    transformed.id = transformed._id.toString();
    Reflect.deleteProperty(transformed, '_id');
    return transformed;
  },
});

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);


