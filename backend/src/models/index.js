const sequelize = require('../config/database');
const User = require('./User');
const Patient = require('./Patient');
const Appointment = require('./Appointment');
const AuditLog = require('./AuditLog');

// Patient <-> Appointment (1:N)
// Cascade delete appointments if patient is permanently removed
Patient.hasMany(Appointment, {
  foreignKey: 'patientId',
  as: 'appointments',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Appointment.belongsTo(Patient, {
  foreignKey: 'patientId',
  as: 'patient'
});

// User <-> Appointment (1:N)
// Restrict deletion of users if they have associated appointment records
User.hasMany(Appointment, {
  foreignKey: 'createdBy',
  as: 'createdAppointments',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
Appointment.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// User <-> AuditLog (1:N)
User.hasMany(AuditLog, {
  foreignKey: 'userId',
  as: 'auditLogs',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
AuditLog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  sequelize,
  User,
  Patient,
  Appointment,
  AuditLog
};
