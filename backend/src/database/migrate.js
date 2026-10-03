const sequelize = require('../config/database');
const logger = require('../utils/logger');
require('../models'); // load associations

const runMigrations = async () => {
  try {
    logger.info('Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    logger.info('Database connection established.');

    // Enable pgcrypto / uuid-ossp extension for UUID generation if needed
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    logger.info('Synchronizing database schema and creating tables & indexes...');
    // Synchronize all models
    await sequelize.sync({ force: false, alter: true });

    // Explicitly verify & create key indexes required by specification
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_patients_cin ON patients(cin);',
      'CREATE INDEX IF NOT EXISTS idx_patients_full_name ON patients(full_name);',
      'CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);',
      'CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);',
      'CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);',
      'CREATE INDEX IF NOT EXISTS idx_appointments_created_by ON appointments(created_by);'
    ];

    for (const query of indexQueries) {
      await sequelize.query(query);
    }

    logger.info('Database migrations applied successfully.');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    logger.error('Migration failed:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
