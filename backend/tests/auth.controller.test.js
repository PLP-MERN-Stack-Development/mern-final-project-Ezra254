"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../src/app"));
jest.setTimeout(20000);
describe('Auth routes', () => {
    let mongo;
    beforeAll(async () => {
        mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongo.getUri());
    });
    afterEach(async () => {
        await mongoose_1.default.connection.dropDatabase();
    });
    afterAll(async () => {
        await mongoose_1.default.connection.close();
        await mongo.stop();
    });
    it('registers a user', async () => {
        const response = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'Password123',
        });
        expect(response.status).toBe(201);
        expect(response.body.user.email).toBe('test@example.com');
    });
});
