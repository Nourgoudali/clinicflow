const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const seedDatabase = require('../src/seed/seed');

let adminToken;
let staffToken;

beforeAll(async () => {
  await sequelize.authenticate();
  await seedDatabase();

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@clinicflow.com', password: 'Admin123!' });
  adminToken = adminLogin.body.token;

  const staffLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'staff1@clinicflow.com', password: 'Staff123!' });
  staffToken = staffLogin.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Patients API', () => {
  let createdPatientId;

  it('should list patients with pagination metadata', async () => {
    const res = await request(app)
      .get('/api/patients?page=1&limit=2')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination.limit).toBe(2);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });

  it('should search patients by full name or CIN', async () => {
    const res = await request(app)
      .get('/api/patients?search=Benali')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].fullName).toContain('Benali');
  });

  it('should create a new patient with digits-only phone and past birth date', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        fullName: 'Noura Mansour',
        cin: 'ZZ998877',
        phone: '0600998877',
        birthDate: '1996-03-25',
        address: '50 Rue Zerktouni, Casablanca'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.cin).toBe('ZZ998877');
    expect(res.body.phone).toBe('0600998877');
    createdPatientId = res.body.id;
  });

  it('should REJECT future birth date (400 Bad Request)', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        fullName: 'Futur Person',
        cin: 'FX123456',
        phone: '0611223344',
        birthDate: '2027-10-20',
        address: 'Test Address'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('La date de naissance ne peut pas être dans le futur.');
  });

  it('should REJECT non-digits in phone number (400 Bad Request)', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        fullName: 'Alpha Phone Person',
        cin: 'AP123456',
        phone: '+212 600-112233',
        birthDate: '1990-01-01',
        address: 'Test Address'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Le numéro de téléphone doit contenir uniquement des chiffres.');
  });

  it('should reject duplicate CIN with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        fullName: 'Another Person',
        cin: 'ZZ998877', // Same CIN
        phone: '0600112233',
        birthDate: '1990-01-01'
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('already exists');
  });

  it('should get patient details by ID including appointments', async () => {
    const res = await request(app)
      .get(`/api/patients/${createdPatientId}`)
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdPatientId);
    expect(res.body).toHaveProperty('appointments');
  });

  it('should update patient details', async () => {
    const res = await request(app)
      .put(`/api/patients/${createdPatientId}`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        phone: '0611223344',
        address: 'New Updated Address'
      });

    expect(res.status).toBe(200);
    expect(res.body.phone).toBe('0611223344');
    expect(res.body.address).toBe('New Updated Address');
  });

  it('should forbid staff from deleting a patient (403 Forbidden)', async () => {
    const res = await request(app)
      .delete(`/api/patients/${createdPatientId}`)
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Forbidden');
  });

  it('should allow admin to delete a patient (200 OK)', async () => {
    const res = await request(app)
      .delete(`/api/patients/${createdPatientId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Patient deleted successfully');
  });
});
