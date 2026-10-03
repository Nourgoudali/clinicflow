const { Client } = require('pg');
const sequelize = require('../config/database');
const logger = require('../utils/logger');
require('../models'); // load associations

const ensureDatabaseExists = async () => {
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '12345';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
  let targetDb = process.env.DB_NAME || 'clinicflow';

  let clientConfig = {
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'postgres'
  };

  if (process.env.DATABASE_URL) {
    try {
      const parsedUrl = new URL(process.env.DATABASE_URL);
      if (parsedUrl.pathname && parsedUrl.pathname !== '/') {
        targetDb = parsedUrl.pathname.replace('/', '');
      }
      clientConfig = {
        user: parsedUrl.username || dbUser,
        password: parsedUrl.password || dbPassword,
        host: parsedUrl.hostname || dbHost,
        port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : dbPort,
        database: 'postgres'
      };
    } catch (err) {
      // Fallback to individual DB env variables
    }
  }

  const client = new Client(clientConfig);
  try {
    await client.connect();
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);
    if (res.rowCount === 0) {
      logger.info(`Database "${targetDb}" does not exist. Creating database...`);
      await client.query(`CREATE DATABASE "${targetDb.replace(/"/g, '""')}"`);
      logger.info(`Database "${targetDb}" created successfully.`);
    }
  } catch (err) {
    logger.error('Error checking/creating database:', err.message);
    throw err;
  } finally {
    await client.end().catch(() => {});
  }
};

const runMigrations = async () => {
  try {
    await ensureDatabaseExists();
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
