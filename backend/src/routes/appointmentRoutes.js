const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  updateAppointmentSchema,
  appointmentQuerySchema
} = require('../validators/appointmentValidators');

// All appointment endpoints require authentication
router.use(authenticate);

// Create an appointment (checks 30-min conflict rule if status=confirmed)
router.post('/', validate(createAppointmentSchema), appointmentController.createAppointment);

// List/filter appointments by date, status, patientId
router.get('/', validate(appointmentQuerySchema, 'query'), appointmentController.getAppointments);

// Get single appointment details
router.get('/:id', appointmentController.getAppointmentById);

// Update status (checks 30-min conflict rule if transitioning to confirmed)
router.patch(
  '/:id/status',
  validate(updateAppointmentStatusSchema),
  appointmentController.updateAppointmentStatus
);

// Update full appointment details
router.put('/:id', validate(updateAppointmentSchema), appointmentController.updateAppointment);

// Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
