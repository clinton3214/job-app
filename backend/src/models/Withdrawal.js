// backend/src/models/Withdrawal.js
import { DataTypes } from 'sequelize';
import  sequelize  from './db.js';


export const Withdrawal = sequelize.define('Withdrawal', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  method: {
    type: DataTypes.ENUM('crypto', 'card', 'cashapp'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending','successful','failed'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,  // adds createdAt, updatedAt
});
