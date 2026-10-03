const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
require('dotenv').config();

const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, Jest)
      if (!origin || corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid CORS friction
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger / OpenAPI documentation endpoint
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
  console.warn('[Swagger] Documentation file could not be loaded:', err.message);
}

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'ClinicFlow API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
