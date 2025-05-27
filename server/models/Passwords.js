const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Passwords = sequelize.define("Passwords", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id"
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

module.exports = Passwords;
