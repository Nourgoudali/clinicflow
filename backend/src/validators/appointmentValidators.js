const { z } = require('zod');

const createAppointmentSchema = z.object({
  patientId: z.string({
    required_error: 'Patient ID is required'
  }).uuid('Invalid patient ID format'),
  appointmentDate: z.string({
    required_error: 'Appointment date and time are required'
  }).refine((date) => !isNaN(Date.parse(date)), {
    message: 'Valid appointment date and time are required'
  }),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional().default('pending'),
  reason: z.string({
    required_error: 'Reason for appointment is required'
  }).trim().min(2, 'Reason must be at least 2 characters'),
  notes: z.string().trim().optional().nullable()
});

const updateAppointmentStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled'], {
    required_error: 'Status is required'
  })
});

const updateAppointmentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID format').optional(),
  appointmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Valid appointment date and time are required'
  }).optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  reason: z.string().trim().min(2, 'Reason must be at least 2 characters').optional(),
  notes: z.string().trim().optional().nullable()
});

const appointmentQuerySchema = z.object({
  date: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  patientId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional()
});

module.exports = {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  updateAppointmentSchema,
  appointmentQuerySchema
};
