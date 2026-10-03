const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Ensure models are synchronized in development if tables don't exist
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      logger.info('Database models synchronized.');
    }

    const server = app.listen(PORT, () => {
      logger.info(`ClinicFlow Server running on port ${PORT}`);
      logger.info(`API Health: http://localhost:${PORT}/api/health`);
      logger.info(`Swagger Docs: http://localhost:${PORT}/api/docs`);
    });

    const shutdown = async () => {
      logger.info('Gracefully shutting down...');
      server.close(async () => {
        await sequelize.close();
        logger.info('Database connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
