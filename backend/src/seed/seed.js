const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { User, Patient, Appointment, AuditLog } = require('../models');
const logger = require('../utils/logger');

const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');
    await sequelize.authenticate();

    // Clear existing data in reverse order of relationships
    logger.info('Cleaning up existing records...');
    await AuditLog.destroy({ where: {}, force: true });
    await Appointment.destroy({ where: {}, force: true });
    await Patient.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    // 1. Seed Users (1 Admin, 2 Staff)
    logger.info('Seeding users...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin123!', salt);
    const staffPasswordHash = await bcrypt.hash('Staff123!', salt);

    const [admin, staff1, staff2] = await Promise.all([
      User.create({
        email: 'admin@clinicflow.com',
        password: adminPasswordHash,
        role: 'admin'
      }),
      User.create({
        email: 'staff1@clinicflow.com',
        password: staffPasswordHash,
        role: 'staff'
      }),
      User.create({
        email: 'staff2@clinicflow.com',
        password: staffPasswordHash,
        role: 'staff'
      })
    ]);

    logger.info(`Seeded ${3} users (1 Admin, 2 Staff).`);

    // 2. Seed Patients (5 Patients with digits-only phone numbers and valid past birth dates)
    logger.info('Seeding patients...');
    const patients = await Promise.all([
      Patient.create({
        fullName: 'Fatima Zahra Benali',
        cin: 'AB123456',
        phone: '0612345678',
        birthDate: '1988-04-12',
        address: "14 Boulevard d'Anfa, Casablanca"
      }),
      Patient.create({
        fullName: 'Mohammed Amine Tazi',
        cin: 'CD789012',
        phone: '0661890123',
        birthDate: '1975-11-23',
        address: '45 Avenue Hassan II, Rabat'
      }),
      Patient.create({
        fullName: 'Yassine El Idrissi',
        cin: 'EF345678',
        phone: '0663456789',
        birthDate: '1995-08-30',
        address: '8 Rue Ibn Batouta, Tanger'
      }),
      Patient.create({
        fullName: 'Salma Chraibi',
        cin: 'GH901234',
        phone: '0654321098',
        birthDate: '1992-02-18',
        address: '22 Rue de la Liberté, Marrakech'
      }),
      Patient.create({
        fullName: 'Karim Mansouri',
        cin: 'IJ567890',
        phone: '0670112233',
        birthDate: '2001-07-05',
        address: '17 Avenue des FAR, Fès'
      })
    ]);

    logger.info(`Seeded ${patients.length} patients.`);

    // 3. Seed Appointments (10 Appointments, mix of pending/confirmed/cancelled, strictly respecting 30-min rule)
    logger.info('Seeding appointments...');

    const today = new Date();
    const setTime = (baseDate, daysOffset, hours, minutes) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + daysOffset);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const appointmentsData = [
      // Patient 1
      {
        patientId: patients[0].id,
        appointmentDate: setTime(today, 0, 9, 0), // Today 09:00
        status: 'confirmed',
        reason: 'Consultation cardiologie de suivi',
        notes: 'Prendre la tension artérielle en priorité',
        createdBy: admin.id
      },
      {
        patientId: patients[0].id,
        appointmentDate: setTime(today, 3, 14, 0), // in 3 days 14:00
        status: 'pending',
        reason: 'Bilan sanguin annuel et cholestérol',
        notes: 'À jeun depuis la veille',
        createdBy: staff1.id
      },
      // Patient 2
      {
        patientId: patients[1].id,
        appointmentDate: setTime(today, 0, 11, 30), // Today 11:30
        status: 'confirmed',
        reason: 'Douleurs articulaires genou droit',
        notes: 'Radio préalable apportée par le patient',
        createdBy: staff2.id
      },
      {
        patientId: patients[1].id,
        appointmentDate: setTime(today, -1, 16, 0), // Yesterday 16:00
        status: 'cancelled',
        reason: 'Contrôle post-opératoire',
        notes: "Annulé par le patient en raison d'un empêchement professionnel",
        createdBy: staff1.id
      },
      // Patient 3
      {
        patientId: patients[2].id,
        appointmentDate: setTime(today, 0, 15, 0), // Today 15:00
        status: 'confirmed',
        reason: "Renouvellement d'ordonnance et suivi tension",
        notes: 'Traitement antihypertenseur à ajuster',
        createdBy: staff1.id
      },
      {
        patientId: patients[2].id,
        appointmentDate: setTime(today, 1, 10, 30), // Tomorrow 10:30
        status: 'pending',
        reason: 'Examen dermatologique grains de beauté',
        notes: 'Demande un examen complet du dos',
        createdBy: staff2.id
      },
      // Patient 4
      {
        patientId: patients[3].id,
        appointmentDate: setTime(today, 1, 9, 30), // Tomorrow 09:30
        status: 'confirmed',
        reason: 'Échographie abdominale générale',
        notes: 'Boire 1 litre d eau avant l examen',
        createdBy: admin.id
      },
      {
        patientId: patients[3].id,
        appointmentDate: setTime(today, 2, 16, 0), // In 2 days 16:00
        status: 'pending',
        reason: 'Consultation nutrition et régime diabète',
        notes: 'Carnet de glycémie à vérifier',
        createdBy: staff1.id
      },
      // Patient 5
      {
        patientId: patients[4].id,
        appointmentDate: setTime(today, 0, 16, 30), // Today 16:30
        status: 'confirmed',
        reason: 'Symptômes grippaux aigus et fièvre 39°C',
        notes: 'Isolement préventif recommandé',
        createdBy: staff2.id
      },
      {
        patientId: patients[4].id,
        appointmentDate: setTime(today, 4, 10, 0), // In 4 days 10:00
        status: 'cancelled',
        reason: "Certificat médical d'aptitude au sport",
        notes: 'Reporté à la semaine prochaine',
        createdBy: admin.id
      }
    ];

    await Appointment.bulkCreate(appointmentsData);
    logger.info(`Seeded ${appointmentsData.length} appointments.`);

    // 4. Seed sample Audit Logs
    logger.info('Seeding initial audit logs...');
    await AuditLog.bulkCreate([
      {
        userId: admin.id,
        action: 'SEED_INITIALIZATION',
        entity: 'System',
        entityId: 'SYSTEM',
        details: { message: 'Database initialized with test seed data' }
      },
      {
        userId: staff1.id,
        action: 'CREATE_PATIENT',
        entity: 'Patient',
        entityId: patients[0].id,
        details: { fullName: patients[0].fullName, cin: patients[0].cin }
      }
    ]);

    logger.info('Database seeded successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    logger.error('Seeding failed:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
