const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name'
  },
  cin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'cin'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'phone'
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'birth_date'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'address'
  }
}, {
  tableName: 'patients',
  timestamps: true,
  underscored: true,
  paranoid: true, // soft delete bonus (deleted_at)
  indexes: [
    {
      unique: true,
      fields: ['cin']
    },
    {
      fields: ['full_name']
    }
  ]
});

module.exports = Patient;
