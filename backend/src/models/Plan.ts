import mongoose, { Document, Schema, Types } from 'mongoose';

export type PlanStatus = 'draft' | 'active' | 'paused' | 'completed';
export type PlanIntensity = 'low' | 'moderate' | 'high';

export interface IPlanSession {
  _id: Types.ObjectId;
  day: string;
  title: string;
  notes?: string;
  targetDuration?: number;
  focusArea?: string;
  status?: 'planned' | 'completed' | 'skipped';
}

export interface IPlan extends Document {
  user: Types.ObjectId;
  name: string;
  goal: string;
  focusArea: string;
  status: PlanStatus;
  intensity: PlanIntensity;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  sessions: IPlanSession[];
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<IPlanSession>(
  {
    day: { type: String, required: true },
    title: { type: String, required: true },
    notes: String,
    targetDuration: Number,
    focusArea: String,
    status: { type: String, enum: ['planned', 'completed', 'skipped'], default: 'planned' },
  },
  { _id: true }
);

sessionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const transformed = ret as typeof ret & { id?: string };
    transformed.id = transformed._id.toString();
    Reflect.deleteProperty(transformed, '_id');
    return transformed;
  },
});

const planSchema = new Schema<IPlan>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    goal: { type: String, required: true },
    focusArea: { type: String, required: true },
    status: { type: String, enum: ['draft', 'active', 'paused', 'completed'], default: 'draft' },
    intensity: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    notes: { type: String },
    sessions: { type: [sessionSchema], default: [] },
  },
  { timestamps: true }
);

planSchema.index({ user: 1, status: 1 });
planSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const transformed = ret as typeof ret & { id?: string };
    transformed.id = transformed._id.toString();
    Reflect.deleteProperty(transformed, '_id');
    return transformed;
  },
});

export const Plan = mongoose.model<IPlan>('Plan', planSchema);


