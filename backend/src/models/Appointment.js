const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'patient_id'
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'appointment_date'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
    field: 'status'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'reason'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'notes'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by'
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['appointment_date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['patient_id']
    },
    {
      fields: ['created_by']
    }
  ]
});

module.exports = Appointment;
