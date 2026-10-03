const { Op } = require('sequelize');
const { Patient, Appointment } = require('../models');

const getDashboardStats = async () => {
  // Total active patients
  const totalPatients = await Patient.count();

  // Today's appointments (start to end of today UTC/local)
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const todayAppointments = await Appointment.count({
    where: {
      appointmentDate: {
        [Op.between]: [startOfDay, endOfDay]
      }
    }
  });

  // Pending appointments
  const pendingAppointments = await Appointment.count({
    where: { status: 'pending' }
  });

  // Confirmed appointments
  const confirmedAppointments = await Appointment.count({
    where: { status: 'confirmed' }
  });

  // Also include cancelled count for complete metrics
  const cancelledAppointments = await Appointment.count({
    where: { status: 'cancelled' }
  });

  return {
    totalPatients,
    todayAppointments,
    pendingAppointments,
    confirmedAppointments,
    cancelledAppointments
  };
};

module.exports = {
  getDashboardStats
};
