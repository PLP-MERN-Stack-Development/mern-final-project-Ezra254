import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  roles: string[];
  preferences: {
    weeklyGoal: number;
    measurementSystem: 'metric' | 'imperial';
    reminders: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  fullName: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    avatarUrl: String,
    age: Number,
    heightCm: Number,
    weightKg: Number,
    roles: { type: [String], default: ['user'] },
    preferences: {
      weeklyGoal: { type: Number, default: 4 },
      measurementSystem: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
      reminders: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

userSchema.virtual('fullName').get(function getFullName(this: IUser) {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);

