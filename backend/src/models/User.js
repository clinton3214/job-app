import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';
import bcrypt from 'bcrypt';

export const User = sequelize.define('User', {
  fullName:     { type: DataTypes.STRING, allowNull: false },
  address:      { type: DataTypes.STRING, allowNull: false },
  state:        { type: DataTypes.STRING, allowNull: false },
  zip:          { type: DataTypes.STRING, allowNull: false },
  homePhone:    { type: DataTypes.STRING, allowNull: false },
  cellPhone:    { type: DataTypes.STRING, allowNull: false },
  email:        { type: DataTypes.STRING, allowNull: false, unique: true },
  password:     { type: DataTypes.STRING, allowNull: false },
  balance:      { type: DataTypes.FLOAT, defaultValue: 0 },
  referralBonus:{ type: DataTypes.FLOAT, defaultValue: 0 },
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12);
    },
  },
});

// Instance method to compare password
User.prototype.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};
