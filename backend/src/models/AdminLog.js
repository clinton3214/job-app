// backend/src/models/AdminLog.js
import { DataTypes } from 'sequelize';
import  sequelize  from './db.js';

export const AdminLog = sequelize.define('AdminLog', {
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});
