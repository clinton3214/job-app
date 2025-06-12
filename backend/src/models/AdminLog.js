import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const AdminLog = sequelize.define('AdminLog', {
  userEmail: { type: DataTypes.STRING, allowNull: false },
  ip:        { type: DataTypes.STRING },
  time:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
