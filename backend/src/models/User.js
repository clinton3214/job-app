import { DataTypes } from 'sequelize';
import  sequelize  from './db.js';
import bcrypt from 'bcryptjs';

export const User = sequelize.define('User', {
  fullName:         { type: DataTypes.STRING, allowNull: false },
  address:          { type: DataTypes.STRING, allowNull: false },
  state:            { type: DataTypes.STRING, allowNull: false },
  zip:              { type: DataTypes.STRING, allowNull: false },
  homePhone:        { type: DataTypes.STRING, allowNull: false },
  cellPhone:        { type: DataTypes.STRING, allowNull: false },
  email:            { type: DataTypes.STRING, allowNull: false, unique: true },
  password:         { type: DataTypes.STRING, allowNull: false },

  verified:         { type: DataTypes.BOOLEAN, defaultValue: false },
  verificationToken:{ type: DataTypes.STRING, allowNull: true },
  resetToken:       { type: DataTypes.STRING, allowNull: true },
  resetTokenExpiry: { type: DataTypes.DATE, allowNull: true },

  balance:          { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  referralBonus:    { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },

  referralCode:     { type: DataTypes.STRING, allowNull: false, unique: true },
  referredBy:       { type: DataTypes.STRING, allowNull: true },

  isAdmin:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // ✅ Added

}, {
  hooks: {
    beforeCreate: async (user) => {
      // Hash the password before saving
      user.password = await bcrypt.hash(user.password, 12);

      // Auto-generate referral code if not provided
      if (!user.referralCode) {
        user.referralCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      }
    },
  },
});

// Instance method to compare passwords
User.prototype.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default User;