const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');

/**
 * Checks if a patient has any confirmed appointment within 30 minutes of the target date.
 * Business Rule: A patient cannot have two confirmed appointments within a 30-minute window.
 *
 * @param {string} patientId - UUID of the patient
 * @param {Date|string} appointmentDate - Target appointment datetime
 * @param {string|null} excludeAppointmentId - ID to exclude (when updating an existing appointment)
 * @returns {Promise<{ hasConflict: boolean, conflictingAppointment: Appointment|null }>}
 */
const checkAppointmentConflict = async (patientId, appointmentDate, excludeAppointmentId = null) => {
  const targetTime = new Date(appointmentDate).getTime();
  const windowMs = 30 * 60 * 1000; // 30 minutes in milliseconds

  const windowStart = new Date(targetTime - windowMs);
  const windowEnd = new Date(targetTime + windowMs);

  const whereClause = {
    patientId,
    status: 'confirmed',
    appointmentDate: {
      [Op.gt]: windowStart,
      [Op.lt]: windowEnd
    }
  };

  if (excludeAppointmentId) {
    whereClause.id = {
      [Op.ne]: excludeAppointmentId
    };
  }

  const conflictingAppointment = await Appointment.findOne({
    where: whereClause
  });

  return {
    hasConflict: !!conflictingAppointment,
    conflictingAppointment
  };
};

module.exports = {
  checkAppointmentConflict
};
