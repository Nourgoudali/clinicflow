const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticate = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  createPatientSchema,
  updatePatientSchema,
  patientQuerySchema
} = require('../validators/patientValidators');

// All patient endpoints require authentication
router.use(authenticate);

// Create patient (staff and admin)
router.post('/', validate(createPatientSchema), patientController.createPatient);

// Get paginated list of patients with search (staff and admin)
router.get('/', validate(patientQuerySchema, 'query'), patientController.getPatients);

// Get patient details by ID with their appointments (staff and admin)
router.get('/:id', patientController.getPatientById);

// Update patient details (staff and admin)
router.put('/:id', validate(updatePatientSchema), patientController.updatePatient);

// Delete patient (admin ONLY)
router.delete('/:id', authorizeRole('admin'), patientController.deletePatient);

module.exports = router;
