import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';

jest.setTimeout(20000);

describe('Auth routes', () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('registers a user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('test@example.com');
  });
});

