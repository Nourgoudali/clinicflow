const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'test' ? false : (msg) => {
      // Keep console clean unless DEBUG=true
      if (process.env.DEBUG === 'true') {
        console.log(`[Sequelize] ${msg}`);
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'clinicflow',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '12345',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'test' ? false : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true
      }
    }
  );
}

module.exports = sequelize;
