import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

mongoose.set('strictQuery', true);

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!env.mongoUri || env.mongoUri === 'mongodb://127.0.0.1:27017/vitaltrack') {
      logger.warn('⚠️  Using default MongoDB URI. Set MONGODB_URI environment variable for production.');
    }
    await mongoose.connect(env.mongoUri);
    logger.info(`✅ MongoDB connected to ${env.mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error instanceof Error ? error.message : error);
    logger.error('Connection string:', env.mongoUri ? 'Set (hidden)' : 'NOT SET');
    throw error; // Re-throw to let caller handle
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};

