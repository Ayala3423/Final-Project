const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
,
  conversationId: {
    type: DataTypes.UUID,
    allowNull: true
  }
  
}, {
  tableName: 'Messages',
   paranoid: true, 
    timestamps: true 
});

module.exports = Message;