const { Op } = require('sequelize');
const { Appointment, Patient, User, AuditLog } = require('../models');
const { checkAppointmentConflict } = require('../utils/conflictChecker');
const { AppError } = require('../middlewares/errorMiddleware');

const createAppointment = async (appointmentData, userId) => {
  const patient = await Patient.findByPk(appointmentData.patientId);
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  const status = appointmentData.status || 'pending';

  // Critical Business Rule: A patient cannot have 2 confirmed appointments within a 30-minute window
  if (status === 'confirmed') {
    const { hasConflict, conflictingAppointment } = await checkAppointmentConflict(
      appointmentData.patientId,
      appointmentData.appointmentDate
    );

    if (hasConflict) {
      const conflictTime = new Date(conflictingAppointment.appointmentDate).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      throw new AppError(
        `This patient already has a confirmed appointment within a 30-minute window (at ${conflictTime})`,
        409
      );
    }
  }

  const appointment = await Appointment.create({
    ...appointmentData,
    status,
    createdBy: userId
  });

  // Audit log
  await AuditLog.create({
    userId,
    action: 'CREATE_APPOINTMENT',
    entity: 'Appointment',
    entityId: appointment.id,
    details: {
      patientId: appointment.patientId,
      appointmentDate: appointment.appointmentDate,
      status: appointment.status
    }
  }).catch(() => {});

  return getAppointmentById(appointment.id);
};

const getAppointments = async ({ date, status, patientId, page, limit }) => {
  const whereClause = {};

  if (status) {
    whereClause.status = status;
  }

  if (patientId) {
    whereClause.patientId = patientId;
  }

  if (date) {
    // Search within full day of provided date (YYYY-MM-DD)
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);

    if (!isNaN(dayStart.getTime())) {
      whereClause.appointmentDate = {
        [Op.between]: [dayStart, dayEnd]
      };
    }
  }

  const queryOptions = {
    where: whereClause,
    include: [
      {
        model: Patient,
        as: 'patient',
        attributes: ['id', 'fullName', 'cin', 'phone', 'birthDate']
      },
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'email', 'role']
      }
    ],
    order: [['appointmentDate', 'ASC']]
  };

  if (page && limit) {
    const offset = (page - 1) * limit;
    const { rows, count } = await Appointment.findAndCountAll({
      ...queryOptions,
      limit,
      offset
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit) || 1
      }
    };
  }

  const rows = await Appointment.findAll(queryOptions);
  return rows;
};

const getAppointmentById = async (id) => {
  const appointment = await Appointment.findByPk(id, {
    include: [
      {
        model: Patient,
        as: 'patient'
      },
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'email', 'role']
      }
    ]
  });

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  return appointment;
};

const updateAppointmentStatus = async (id, status, userId) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  // Critical Business Rule: Check 30-minute conflict when setting to confirmed
  if (status === 'confirmed') {
    const { hasConflict, conflictingAppointment } = await checkAppointmentConflict(
      appointment.patientId,
      appointment.appointmentDate,
      appointment.id
    );

    if (hasConflict) {
      const conflictTime = new Date(conflictingAppointment.appointmentDate).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      throw new AppError(
        `This patient already has a confirmed appointment within a 30-minute window (at ${conflictTime})`,
        409
      );
    }
  }

  const oldStatus = appointment.status;
  await appointment.update({ status });

  // Audit log
  await AuditLog.create({
    userId,
    action: 'UPDATE_APPOINTMENT_STATUS',
    entity: 'Appointment',
    entityId: appointment.id,
    details: { oldStatus, newStatus: status }
  }).catch(() => {});

  return getAppointmentById(appointment.id);
};

const updateAppointment = async (id, updateData, userId) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  const effectivePatientId = updateData.patientId || appointment.patientId;
  const effectiveDate = updateData.appointmentDate || appointment.appointmentDate;
  const effectiveStatus = updateData.status || appointment.status;

  if (effectiveStatus === 'confirmed') {
    const { hasConflict, conflictingAppointment } = await checkAppointmentConflict(
      effectivePatientId,
      effectiveDate,
      appointment.id
    );

    if (hasConflict) {
      const conflictTime = new Date(conflictingAppointment.appointmentDate).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      throw new AppError(
        `This patient already has a confirmed appointment within a 30-minute window (at ${conflictTime})`,
        409
      );
    }
  }

  await appointment.update(updateData);

  // Audit log
  await AuditLog.create({
    userId,
    action: 'UPDATE_APPOINTMENT',
    entity: 'Appointment',
    entityId: appointment.id,
    details: updateData
  }).catch(() => {});

  return getAppointmentById(appointment.id);
};

const deleteAppointment = async (id, userId) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  await appointment.destroy();

  // Audit log
  await AuditLog.create({
    userId,
    action: 'DELETE_APPOINTMENT',
    entity: 'Appointment',
    entityId: id
  }).catch(() => {});

  return { message: 'Appointment deleted successfully' };
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment
};
