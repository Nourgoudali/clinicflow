const request = require('supertest');
const app = require('../src/app');
const { sequelize, Patient } = require('../src/models');
const seedDatabase = require('../src/seed/seed');

let staffToken;
let testPatientId;

beforeAll(async () => {
  await sequelize.authenticate();
  await seedDatabase();

  const staffLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'staff1@clinicflow.com', password: 'Staff123!' });
  staffToken = staffLogin.body.token;

  const patient = await Patient.findOne();
  testPatientId = patient.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Appointments API and Business Rules', () => {
  let pendingAppointmentId;

  it('should list appointments with optional filters', async () => {
    const res = await request(app)
      .get('/api/appointments?status=confirmed')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((apt) => {
      expect(apt.status).toBe('confirmed');
      expect(apt).toHaveProperty('patient');
      expect(apt).toHaveProperty('creator');
    });
  });

  it('should create a pending appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        patientId: testPatientId,
        appointmentDate: '2026-11-15T14:00:00.000Z',
        status: 'pending',
        reason: 'Consultation ophtalmologique',
        notes: 'Contrôle vue annuel'
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');
    expect(res.body.patientId).toBe(testPatientId);
    pendingAppointmentId = res.body.id;
  });

  it('should update appointment status', async () => {
    const res = await request(app)
      .patch(`/api/appointments/${pendingAppointmentId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ status: 'cancelled' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelled');
  });

  describe('30-Minute Confirmed Appointment Business Rule', () => {
    const baseDate = new Date('2026-12-01T10:00:00.000Z');

    it('should create a confirmed appointment at 10:00', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          patientId: testPatientId,
          appointmentDate: baseDate.toISOString(),
          status: 'confirmed',
          reason: 'Première consultation test règle 30 min'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('confirmed');
    });

    it('should REJECT another confirmed appointment at 10:15 for the SAME patient (409 Conflict)', async () => {
      const conflictDate = new Date('2026-12-01T10:15:00.000Z');

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          patientId: testPatientId,
          appointmentDate: conflictDate.toISOString(),
          status: 'confirmed',
          reason: 'Deuxième consultation trop proche (15 min)'
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('30-minute');
    });

    it('should REJECT confirming a pending appointment at 10:20 that conflicts with 10:00 (409 Conflict)', async () => {
      const conflictDate = new Date('2026-12-01T10:20:00.000Z');

      // Create as pending first
      const createRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          patientId: testPatientId,
          appointmentDate: conflictDate.toISOString(),
          status: 'pending',
          reason: 'Rendez-vous créé pending'
        });

      expect(createRes.status).toBe(201);
      const conflictApptId = createRes.body.id;

      // Now attempt to confirm
      const confirmRes = await request(app)
        .patch(`/api/appointments/${conflictApptId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ status: 'confirmed' });

      expect(confirmRes.status).toBe(409);
      expect(confirmRes.body.message).toContain('30-minute');
    });

    it('should ALLOW a confirmed appointment at 10:45 for the SAME patient (outside 30-minute window)', async () => {
      const validDate = new Date('2026-12-01T10:45:00.000Z');

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          patientId: testPatientId,
          appointmentDate: validDate.toISOString(),
          status: 'confirmed',
          reason: 'Consultation autorisée 45 min après'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('confirmed');
    });
  });
});
