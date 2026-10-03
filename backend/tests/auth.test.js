const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const seedDatabase = require('../src/seed/seed');

beforeAll(async () => {
  await sequelize.authenticate();
  await seedDatabase();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Authentication API', () => {
  it('should authenticate admin with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@clinicflow.com',
        password: 'Admin123!'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('admin@clinicflow.com');
    expect(res.body.user.role).toBe('admin');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should authenticate staff with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'staff1@clinicflow.com',
        password: 'Staff123!'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('staff');
  });

  it('should reject invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@clinicflow.com',
        password: 'WrongPassword!'
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('should reject non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'unknown@clinicflow.com',
        password: 'Password123!'
      });

    expect(res.status).toBe(401);
  });

  it('should reject access to protected endpoint without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('should return current user with valid token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@clinicflow.com',
        password: 'Admin123!'
      });

    const token = loginRes.body.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('admin@clinicflow.com');
  });
});
