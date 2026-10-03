const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'ClinicFlow API',
    timestamp: new Date().toISOString()
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
