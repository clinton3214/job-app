// models/message.js
import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { User } from './User.js'; // ✅ Correct import

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
  isAdmin: {                      // ✅ This field tracks if sender is admin
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Optional relationships — only needed if you're using associations
User.hasMany(Message, { foreignKey: 'senderEmail', sourceKey: 'email' });
User.hasMany(Message, { foreignKey: 'receiverEmail', sourceKey: 'email' });

export default Message;