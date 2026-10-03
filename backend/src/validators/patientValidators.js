const { z } = require('zod');

// Helper to validate that a date string is not in the future
const isNotFutureDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
};

const createPatientSchema = z.object({
  fullName: z.string({
    required_error: 'Full name is required'
  }).trim().min(2, 'Full name must be at least 2 characters').max(255),
  cin: z.string({
    required_error: 'CIN is required'
  }).trim().min(2, 'CIN must be at least 2 characters').max(50).toUpperCase(),
  phone: z.string({
    required_error: 'Le numéro de téléphone est requis'
  })
    .trim()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(/^\d+$/, 'Le numéro de téléphone doit contenir uniquement des chiffres.')
    .min(6, 'Le numéro de téléphone doit comporter au moins 6 chiffres')
    .max(50, 'Le numéro de téléphone est trop long'),
  birthDate: z.string({
    required_error: 'La date de naissance est requise'
  })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Format de date de naissance invalide (AAAA-MM-JJ)'
    })
    .refine(isNotFutureDate, {
      message: 'La date de naissance ne peut pas être dans le futur.'
    }),
  address: z.string().trim().optional().nullable()
});

const updatePatientSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(255).optional(),
  cin: z.string().trim().min(2, 'CIN must be at least 2 characters').max(50).toUpperCase().optional(),
  phone: z.string()
    .trim()
    .regex(/^\d+$/, 'Le numéro de téléphone doit contenir uniquement des chiffres.')
    .min(6, 'Le numéro de téléphone doit comporter au moins 6 chiffres')
    .max(50, 'Le numéro de téléphone est trop long')
    .optional(),
  birthDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Format de date de naissance invalide'
    })
    .refine(isNotFutureDate, {
      message: 'La date de naissance ne peut pas être dans le futur.'
    })
    .optional(),
  address: z.string().trim().optional().nullable()
});

const patientQuerySchema = z.object({
  search: z.string().optional().default(''),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10)
});

module.exports = {
  createPatientSchema,
  updatePatientSchema,
  patientQuerySchema
};
