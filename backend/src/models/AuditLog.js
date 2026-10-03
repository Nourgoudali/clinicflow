const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id'
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'action'
  },
  entity: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'entity'
  },
  entityId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'entity_id'
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'details'
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false,
  underscored: true
});

module.exports = AuditLog;
