const { Op } = require('sequelize');
const { Patient, Appointment, AuditLog, User } = require('../models');
const { AppError } = require('../middlewares/errorMiddleware');

const createPatient = async (patientData, userId) => {
  const existingPatient = await Patient.findOne({
    where: { cin: patientData.cin },
    paranoid: false // check even deleted to prevent unique collisions
  });

  if (existingPatient) {
    throw new AppError(`Patient with CIN "${patientData.cin}" already exists`, 409);
  }

  const patient = await Patient.create(patientData);

  // Audit log
  await AuditLog.create({
    userId,
    action: 'CREATE_PATIENT',
    entity: 'Patient',
    entityId: patient.id,
    details: { fullName: patient.fullName, cin: patient.cin }
  }).catch(() => {});

  return patient;
};

const getPatients = async ({ search = '', page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (search && search.trim() !== '') {
    const term = `%${search.trim()}%`;
    whereClause[Op.or] = [
      { fullName: { [Op.iLike]: term } },
      { cin: { [Op.iLike]: term } }
    ];
  }

  const { rows, count } = await Patient.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
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
};

const getPatientById = async (id) => {
  const patient = await Patient.findByPk(id, {
    include: [
      {
        model: Appointment,
        as: 'appointments',
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'email', 'role']
          }
        ],
        order: [['appointmentDate', 'DESC']]
      }
    ]
  });

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  return patient;
};

const updatePatient = async (id, updateData, userId) => {
  const patient = await Patient.findByPk(id);
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  if (updateData.cin && updateData.cin !== patient.cin) {
    const existing = await Patient.findOne({
      where: { cin: updateData.cin, id: { [Op.ne]: id } },
      paranoid: false
    });
    if (existing) {
      throw new AppError(`Patient with CIN "${updateData.cin}" already exists`, 409);
    }
  }

  await patient.update(updateData);

  // Audit log
  await AuditLog.create({
    userId,
    action: 'UPDATE_PATIENT',
    entity: 'Patient',
    entityId: patient.id,
    details: updateData
  }).catch(() => {});

  return patient;
};

const deletePatient = async (id, userId) => {
  const patient = await Patient.findByPk(id);
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Soft delete patient (or cascade appointments)
  await patient.destroy();

  // Audit log
  await AuditLog.create({
    userId,
    action: 'DELETE_PATIENT',
    entity: 'Patient',
    entityId: id,
    details: { fullName: patient.fullName, cin: patient.cin }
  }).catch(() => {});

  return { message: 'Patient deleted successfully' };
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
};
