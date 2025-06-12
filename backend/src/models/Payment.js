import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Payment = sequelize.define('Payment', {
  userEmail: { type: DataTypes.STRING, allowNull: false },
  amount:    { type: DataTypes.FLOAT, allowNull: false },
  method:    { type: DataTypes.STRING, allowNull: false },
  status:    { type: DataTypes.STRING, allowNull: false },
  time:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
