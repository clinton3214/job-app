// models/message.js
import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { User } from './User.js';

const Message = sequelize.define('Message', {
  senderEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiverEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Message, { foreignKey: 'senderEmail', sourceKey: 'email' });
User.hasMany(Message, { foreignKey: 'receiverEmail', sourceKey: 'email' });

export default Message;